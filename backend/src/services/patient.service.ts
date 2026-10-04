import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import {
  CreatePatientInput, UpdatePatientInput,
  CreateVisitInput, CreatePrescriptionInput,
} from "../validators/patient.validator";
import { writeAudit, AuditContext } from "./audit.service";

// ─── ID Generator ─────────────────────────────────────────────────────────────

async function generatePatientId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PAT-${year}-`;
  const last = await prisma.patient.findFirst({
    where:   { patientId: { startsWith: prefix } },
    orderBy: { patientId: "desc" },
    select:  { patientId: true },
  });
  const seq = last ? parseInt(last.patientId.split("-")[2] || "0", 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

// ─── Selects ──────────────────────────────────────────────────────────────────

export const PATIENT_SELECT = {
  id: true, patientId: true, nameBn: true, nameEn: true,
  phone: true, email: true, age: true, gender: true,
  address: true, emergencyContact: true, medicalHistory: true,
  notes: true, registeredBy: true, isActive: true,
  createdAt: true, updatedAt: true,
  _count: { select: { visits: true, prescriptions: true } },
};

export const ITEM_SELECT = {
  id: true, medicineName: true, dose: true,
  frequency: true, duration: true, instructions: true, sortOrder: true,
};

export const VISIT_SELECT = {
  id: true, visitDate: true, chiefComplaint: true, appointmentId: true,
  diagnosis: true, treatment: true, followUpDate: true,
  notes: true, createdBy: true, createdAt: true, updatedAt: true,
  doctor: { select: { id: true, nameBn: true, nameEn: true, designationBn: true } },
  prescriptions: {
    select: {
      id: true, diagnosis: true, instructions: true, doctorNotes: true,
      followUpDate: true, createdAt: true,
      items: { select: ITEM_SELECT, orderBy: { sortOrder: "asc" as const } },
    },
  },
};

export const PRESCRIPTION_SELECT = {
  id: true, rxNo: true, diagnosis: true, instructions: true, doctorNotes: true,
  chiefComplaint: true, history: true, examNotes: true, investigations: true, advice: true,
  vaRightEye: true, vaLeftEye: true, iopRightEye: true, iopLeftEye: true,
  refractionRE: true, refractionLE: true,
  followUpDate: true, followUpNote: true, createdBy: true, createdAt: true, updatedAt: true,
  doctor: { select: { id: true, nameBn: true, nameEn: true, designationBn: true, qualificationBn: true, phone: true,
    prescriptionSettings: { select: { bmdcNo: true, signatureUrl: true } },
  } },
  visit:  { select: { id: true, visitDate: true, chiefComplaint: true } },
  patient: { select: { id: true, patientId: true, nameBn: true, nameEn: true, phone: true, age: true, gender: true, address: true } },
  items: { select: ITEM_SELECT, orderBy: { sortOrder: "asc" as const } },
};

// ─── Patient CRUD ─────────────────────────────────────────────────────────────

export async function createPatient(input: CreatePatientInput, registeredBy: string, ctx?: AuditContext) {
  const patientId = await generatePatientId();
  const patient = await prisma.patient.create({
    data: {
      patientId,
      nameBn:           input.nameBn,
      nameEn:           input.nameEn,
      phone:            input.phone,
      email:            input.email || null,
      age:              input.age ?? null,
      gender:           input.gender as any,
      address:          input.address || null,
      emergencyContact: input.emergencyContact || null,
      medicalHistory:   input.medicalHistory || null,
      notes:            input.notes || null,
      registeredBy,
    },
    select: PATIENT_SELECT,
  });
  if (ctx) writeAudit({ ctx, action: "CREATE", module: "patient", recordId: patient.id, recordLabel: `${patientId} — ${input.nameBn}` });
  return patient;
}

export async function listPatients(query: {
  search?: string; gender?: string; isActive?: string;
  page: number; limit: number;
}) {
  const where: any = {};
  if (query.isActive !== undefined) where.isActive = query.isActive === "true";
  if (query.gender)  where.gender = query.gender;
  if (query.search) {
    where.OR = [
      { nameBn:    { contains: query.search, mode: "insensitive" } },
      { nameEn:    { contains: query.search, mode: "insensitive" } },
      { phone:     { contains: query.search } },
      { patientId: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.patient.count({ where }),
    prisma.patient.findMany({
      where, skip, take: query.limit,
      select: PATIENT_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getPatient(id: string) {
  const patient = await prisma.patient.findFirst({
    where: { OR: [{ id }, { patientId: id }] },
    select: {
      ...PATIENT_SELECT,
      visits: {
        select: VISIT_SELECT,
        orderBy: { visitDate: "desc" },
        take: 10,
      },
      prescriptions: {
        select: PRESCRIPTION_SELECT,
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);
  return patient;
}

export async function updatePatient(id: string, input: UpdatePatientInput) {
  const exists = await prisma.patient.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  return prisma.patient.update({
    where: { id },
    data: {
      ...(input.nameBn           !== undefined && { nameBn: input.nameBn }),
      ...(input.nameEn           !== undefined && { nameEn: input.nameEn }),
      ...(input.phone            !== undefined && { phone: input.phone }),
      ...(input.email            !== undefined && { email: input.email || null }),
      ...(input.age              !== undefined && { age: input.age }),
      ...(input.gender           !== undefined && { gender: input.gender as any }),
      ...(input.address          !== undefined && { address: input.address || null }),
      ...(input.emergencyContact !== undefined && { emergencyContact: input.emergencyContact || null }),
      ...(input.medicalHistory   !== undefined && { medicalHistory: input.medicalHistory || null }),
      ...(input.notes            !== undefined && { notes: input.notes || null }),
    },
    select: PATIENT_SELECT,
  });
}

export async function togglePatientStatus(id: string) {
  const patient = await prisma.patient.findUnique({ where: { id }, select: { isActive: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);
  return prisma.patient.update({
    where: { id },
    data:  { isActive: !patient.isActive },
    select: PATIENT_SELECT,
  });
}

// ─── Visits ───────────────────────────────────────────────────────────────────

export async function addVisit(patientId: string, input: CreateVisitInput, createdBy: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  return prisma.visit.create({
    data: {
      patientId,
      appointmentId:  input.appointmentId || null,
      visitDate:      input.visitDate ? new Date(input.visitDate) : new Date(),
      chiefComplaint: input.chiefComplaint || null,
      diagnosis:      input.diagnosis || null,
      treatment:      input.treatment || null,
      doctorId:       input.doctorId || null,
      followUpDate:   input.followUpDate ? new Date(input.followUpDate) : null,
      notes:          input.notes || null,
      createdBy,
    },
    select: VISIT_SELECT,
  });
}

export async function getPatientVisits(patientId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.visit.count({ where: { patientId } }),
    prisma.visit.findMany({
      where: { patientId }, skip, take: limit,
      select: VISIT_SELECT,
      orderBy: { visitDate: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export async function addPrescription(patientId: string, input: CreatePrescriptionInput, createdBy: string, ctx?: AuditContext) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true, nameBn: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  const rx = await prisma.prescription.create({
    data: {
      patientId,
      visitId:        input.visitId || null,
      doctorId:       input.doctorId || null,
      chiefComplaint: (input as any).chiefComplaint || null,
      history:        (input as any).history || null,
      vaRightEye:     (input as any).vaRightEye || null,
      vaLeftEye:      (input as any).vaLeftEye || null,
      iopRightEye:    (input as any).iopRightEye || null,
      iopLeftEye:     (input as any).iopLeftEye || null,
      refractionRE:   (input as any).refractionRE || null,
      refractionLE:   (input as any).refractionLE || null,
      examNotes:      (input as any).examNotes || null,
      diagnosis:      input.diagnosis || null,
      investigations: (input as any).investigations || null,
      advice:         (input as any).advice || null,
      instructions:   input.instructions || null,
      doctorNotes:    input.doctorNotes || null,
      followUpDate:   input.followUpDate ? new Date(input.followUpDate) : null,
      followUpNote:   (input as any).followUpNote || null,
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
  if (ctx) writeAudit({ ctx, action: "CREATE", module: "prescription", recordId: rx.id, recordLabel: `রোগী: ${patient.nameBn}` });
  return rx;
}

export async function getPatientPrescriptions(patientId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.prescription.count({ where: { patientId } }),
    prisma.prescription.findMany({
      where: { patientId }, skip, take: limit,
      select: PRESCRIPTION_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPrescription(id: string) {
  const rx = await prisma.prescription.findUnique({ where: { id }, select: PRESCRIPTION_SELECT });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  return rx;
}

// ─── Appointments for patient ─────────────────────────────────────────────────

export async function getPatientAppointments(phone: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.appointment.count({ where: { phone } }),
    prisma.appointment.findMany({
      where: { phone }, skip, take: limit,
      select: {
        id: true, requestId: true, patientName: true, phone: true,
        preferredDate: true, preferredTime: true, reason: true,
        status: true, adminNote: true, confirmedAt: true, createdAt: true,
        doctor:  { select: { id: true, nameBn: true, designationBn: true } },
        service: { select: { id: true, nameBn: true } },
        visit:   { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}
