import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { PRESCRIPTION_SELECT, VISIT_SELECT, PATIENT_SELECT } from "./patient.service";
import { CreateVisitInput, CreatePrescriptionInput } from "../validators/patient.validator";

// ─── Resolve doctorId from userId ─────────────────────────────────────────────

export async function getDoctorByUserId(userId: string) {
  const doctor = await prisma.doctor.findUnique({
    where:  { userId },
    select: {
      id: true, nameBn: true, nameEn: true, photo: true,
      designationBn: true, qualificationBn: true, phone: true,
      specialtyBn: true, isActive: true,
    },
  });
  if (!doctor) throw new AppError("এই অ্যাকাউন্টের সাথে কোনো চিকিৎসক প্রোফাইল যুক্ত নেই।", 404);
  return doctor;
}

// ─── Today's queue ────────────────────────────────────────────────────────────

export async function getTodayQueue(doctorId: string) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end   = new Date(start.getTime() + 86400000);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId,
      preferredDate: { gte: start, lt: end },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: {
      id: true, requestId: true, patientName: true, phone: true,
      age: true, gender: true, preferredTime: true, reason: true,
      status: true, createdAt: true,
      service: { select: { id: true, nameBn: true } },
      visit:   { select: { id: true } },
    },
    orderBy: { preferredTime: "asc" },
  });

  // Enrich with patient record if exists (matched by phone)
  const phones = [...new Set(appointments.map((a) => a.phone))];
  const patients = await prisma.patient.findMany({
    where: { phone: { in: phones } },
    select: { id: true, patientId: true, phone: true, nameBn: true },
  });
  const patientMap = new Map(patients.map((p) => [p.phone, p]));

  return appointments.map((a) => ({
    ...a,
    patient: patientMap.get(a.phone) || null,
  }));
}

// ─── Doctor's appointments (paginated) ───────────────────────────────────────

export async function getDoctorAppointments(doctorId: string, query: {
  status?: string; dateFrom?: string; dateTo?: string;
  page: number; limit: number;
}) {
  const where: any = { doctorId };
  if (query.status) where.status = query.status;
  if (query.dateFrom || query.dateTo) {
    where.preferredDate = {};
    if (query.dateFrom) where.preferredDate.gte = new Date(query.dateFrom);
    if (query.dateTo)   where.preferredDate.lte = new Date(query.dateTo);
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where, skip, take: query.limit,
      select: {
        id: true, requestId: true, patientName: true, phone: true,
        age: true, gender: true, preferredDate: true, preferredTime: true,
        reason: true, status: true, adminNote: true, createdAt: true,
        service: { select: { id: true, nameBn: true } },
        visit:   { select: { id: true } },
      },
      orderBy: { preferredDate: "desc" },
    }),
  ]);

  const phones = [...new Set(items.map((a) => a.phone))];
  const patients = await prisma.patient.findMany({
    where: { phone: { in: phones } },
    select: { id: true, patientId: true, phone: true, nameBn: true },
  });
  const patientMap = new Map(patients.map((p) => [p.phone, p]));

  return {
    items: items.map((a) => ({ ...a, patient: patientMap.get(a.phone) || null })),
    total, page: query.page, limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
}

// ─── Doctor's patients (visited) ─────────────────────────────────────────────

export async function getDoctorPatients(doctorId: string, query: {
  search?: string; page: number; limit: number;
}) {
  const where: any = { doctorId };
  if (query.search) {
    where.patient = {
      OR: [
        { nameBn:    { contains: query.search, mode: "insensitive" } },
        { phone:     { contains: query.search } },
        { patientId: { contains: query.search, mode: "insensitive" } },
      ],
    };
  }

  const skip = (query.page - 1) * query.limit;
  // Get distinct patients via visits
  const visitRows = await prisma.visit.findMany({
    where,
    select: { patientId: true },
    distinct: ["patientId"],
    skip, take: query.limit,
  });
  const total = await prisma.visit.groupBy({
    by: ["patientId"],
    where,
    _count: true,
  }).then((r) => r.length);

  const patientIds = visitRows.map((v) => v.patientId);
  const patients = await prisma.patient.findMany({
    where: { id: { in: patientIds } },
    select: PATIENT_SELECT,
  });

  return { items: patients, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

// ─── Create visit (doctor-scoped, enforces doctorId) ─────────────────────────

export async function createDoctorVisit(
  patientId: string, doctorId: string,
  input: CreateVisitInput, createdBy: string
) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  // If appointmentId given, verify it belongs to this doctor
  if (input.appointmentId) {
    const appt = await prisma.appointment.findUnique({
      where: { id: input.appointmentId },
      select: { doctorId: true, visit: { select: { id: true } } },
    });
    if (!appt) throw new AppError("অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।", 404);
    if (appt.doctorId !== doctorId) throw new AppError("এই অ্যাপয়েন্টমেন্টে আপনার অ্যাক্সেস নেই।", 403);
    if (appt.visit) throw new AppError("এই অ্যাপয়েন্টমেন্টের জন্য ইতিমধ্যে ভিজিট তৈরি হয়েছে।", 409);
  }

  return prisma.visit.create({
    data: {
      patientId,
      doctorId,
      appointmentId:  input.appointmentId || null,
      visitDate:      input.visitDate ? new Date(input.visitDate) : new Date(),
      chiefComplaint: input.chiefComplaint || null,
      diagnosis:      input.diagnosis || null,
      treatment:      input.treatment || null,
      followUpDate:   input.followUpDate ? new Date(input.followUpDate) : null,
      notes:          input.notes || null,
      createdBy,
    },
    select: VISIT_SELECT,
  });
}

// ─── Create prescription (doctor-scoped) ─────────────────────────────────────

export async function createDoctorPrescription(
  patientId: string, doctorId: string,
  input: CreatePrescriptionInput, createdBy: string
) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  // If visitId given, verify it belongs to this doctor
  if (input.visitId) {
    const visit = await prisma.visit.findUnique({
      where: { id: input.visitId },
      select: { doctorId: true, patientId: true },
    });
    if (!visit) throw new AppError("ভিজিট পাওয়া যায়নি।", 404);
    if (visit.doctorId !== doctorId) throw new AppError("এই ভিজিটে আপনার অ্যাক্সেস নেই।", 403);
  }

  return prisma.prescription.create({
    data: {
      patientId,
      doctorId,
      visitId:      input.visitId || null,
      diagnosis:    input.diagnosis || null,
      instructions: input.instructions || null,
      doctorNotes:  input.doctorNotes || null,
      followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
      createdBy,
      items: {
        create: input.items.map((item, i) => ({
          medicineName: item.medicineName,
          dose:         item.dose || null,
          frequency:    item.frequency || null,
          duration:     item.duration || null,
          instructions: item.instructions || null,
          sortOrder:    item.sortOrder ?? i,
        })),
      },
    },
    select: PRESCRIPTION_SELECT,
  });
}

// ─── Get prescription (doctor must own it) ────────────────────────────────────

export async function getDoctorPrescription(rxId: string, doctorId: string) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: PRESCRIPTION_SELECT });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (rx.doctor?.id !== doctorId) throw new AppError("এই প্রেসক্রিপশনে আপনার অ্যাক্সেস নেই।", 403);
  return rx;
}

// ─── Doctor's recent prescriptions ───────────────────────────────────────────

export async function getDoctorPrescriptions(doctorId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.prescription.count({ where: { doctorId } }),
    prisma.prescription.findMany({
      where: { doctorId }, skip, take: limit,
      select: PRESCRIPTION_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Stats for doctor dashboard ───────────────────────────────────────────────

export async function getDoctorStats(doctorId: string) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end   = new Date(start.getTime() + 86400000);

  const [todayAppts, totalPatients, totalPrescriptions, pendingAppts] = await Promise.all([
    prisma.appointment.count({ where: { doctorId, preferredDate: { gte: start, lt: end } } }),
    prisma.visit.groupBy({ by: ["patientId"], where: { doctorId } }).then((r) => r.length),
    prisma.prescription.count({ where: { doctorId } }),
    prisma.appointment.count({ where: { doctorId, status: "PENDING" } }),
  ]);

  return { todayAppts, totalPatients, totalPrescriptions, pendingAppts };
}
