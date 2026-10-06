import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { writeAudit, AuditContext } from "./audit.service";

// ─── RX Number Generator ──────────────────────────────────────────────────────

async function generateRxNo(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `RX-${year}-`;
  const last = await prisma.prescription.findFirst({
    where:   { rxNo: { startsWith: prefix } },
    orderBy: { rxNo: "desc" },
    select:  { rxNo: true },
  });
  const seq = last ? parseInt(last.rxNo.split("-")[2] || "0", 10) + 1 : 1;
  return `${prefix}${String(seq).padStart(4, "0")}`;
}

// ─── Selects ──────────────────────────────────────────────────────────────────

export const RX_ITEM_SELECT = {
  id: true, medicineName: true, strength: true, dosageForm: true,
  route: true, eye: true, dose: true, frequency: true,
  duration: true, instructions: true, sortOrder: true,
};

export const RX_SELECT = {
  id: true, rxNo: true, rxType: true, status: true,
  finalizedAt: true, finalizedBy: true,
  chiefComplaint: true, history: true, allergies: true, currentMeds: true,
  vaRightEye: true, vaLeftEye: true, refractionRE: true, refractionLE: true,
  iopRightEye: true, iopLeftEye: true, examNotes: true,
  diagnosis: true, investigations: true, instructions: true,
  advice: true, doctorNotes: true, followUpDate: true, followUpNote: true,
  spectacleData: true, doctorSnapshot: true,
  createdBy: true, createdAt: true, updatedAt: true,
  doctor: {
    select: {
      id: true, nameBn: true, nameEn: true,
      designationBn: true, qualificationBn: true, phone: true,
      prescriptionSettings: {
        select: {
          nameBn: true, nameEn: true,
          qualificationBn: true, qualificationEn: true,
          designationBn: true, designationEn: true,
          specialtyBn: true, specialtyEn: true,
          bmdcNo: true, chamberName: true, chamberAddress: true, chamberPhone: true,
          signatureUrl: true, signatureMode: true,
          preferredLang: true, showHeader: true, showFooter: true,
        },
      },
    },
  },
  patient: {
    select: {
      id: true, patientId: true, nameBn: true, nameEn: true,
      phone: true, age: true, gender: true, address: true,
    },
  },
  visit: { select: { id: true, visitDate: true, chiefComplaint: true } },
  items: { select: RX_ITEM_SELECT, orderBy: { sortOrder: "asc" as const } },
  amendments: {
    select: { id: true, reason: true, amendedBy: true, createdAt: true },
    orderBy: { createdAt: "desc" as const },
  },
};

// ─── Doctor Prescription Settings ────────────────────────────────────────────

export async function getDoctorSettings(doctorId: string) {
  return prisma.doctorPrescriptionSettings.findUnique({ where: { doctorId } });
}

export async function upsertDoctorSettings(doctorId: string, data: {
  nameBn?: string; nameEn?: string;
  qualificationBn?: string; qualificationEn?: string;
  designationBn?: string; designationEn?: string;
  specialtyBn?: string; specialtyEn?: string;
  bmdcNo?: string; chamberName?: string;
  chamberAddress?: string; chamberPhone?: string;
  signatureMode?: string; preferredLang?: string;
  showHeader?: boolean; showFooter?: boolean;
}) {
  return prisma.doctorPrescriptionSettings.upsert({
    where:  { doctorId },
    update: data,
    create: { doctorId, ...data },
  });
}

export async function saveSignature(doctorId: string, signatureUrl: string) {
  return prisma.doctorPrescriptionSettings.upsert({
    where:  { doctorId },
    update: { signatureUrl, signatureMode: "uploaded" },
    create: { doctorId, signatureUrl, signatureMode: "uploaded" },
  });
}

export async function removeSignature(doctorId: string) {
  return prisma.doctorPrescriptionSettings.update({
    where: { doctorId },
    data:  { signatureUrl: null, signatureMode: "handwritten" },
  });
}

// ─── Create / Update Prescription ────────────────────────────────────────────

export async function createPrescription(doctorId: string, patientId: string, input: any, createdBy: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true } });
  if (!patient) throw new AppError("রোগী পাওয়া যায়নি।", 404);

  if (input.visitId) {
    const visit = await prisma.visit.findUnique({ where: { id: input.visitId }, select: { doctorId: true } });
    if (!visit) throw new AppError("ভিজিট পাওয়া যায়নি।", 404);
    if (visit.doctorId !== doctorId) throw new AppError("এই ভিজিটে আপনার অ্যাক্সেস নেই।", 403);
  }

  const rxNo = await generateRxNo();

  return prisma.prescription.create({
    data: {
      rxNo,
      patientId,
      doctorId,
      visitId:        input.visitId || null,
      rxType:         input.rxType || "clinical",
      status:         "DRAFT",
      chiefComplaint: input.chiefComplaint || null,
      history:        input.history || null,
      allergies:      input.allergies || null,
      currentMeds:    input.currentMeds || null,
      vaRightEye:     input.vaRightEye || null,
      vaLeftEye:      input.vaLeftEye || null,
      refractionRE:   input.refractionRE || null,
      refractionLE:   input.refractionLE || null,
      iopRightEye:    input.iopRightEye || null,
      iopLeftEye:     input.iopLeftEye || null,
      examNotes:      input.examNotes || null,
      diagnosis:      input.diagnosis || null,
      investigations: input.investigations || null,
      instructions:   input.instructions || null,
      advice:         input.advice || null,
      doctorNotes:    input.doctorNotes || null,
      followUpDate:   input.followUpDate ? new Date(input.followUpDate) : null,
      followUpNote:   input.followUpNote || null,
      spectacleData:  input.spectacleData || null,
      createdBy,
      items: {
        create: (input.items || []).map((item: any, i: number) => ({
          medicineName: item.medicineName,
          strength:     item.strength || null,
          dosageForm:   item.dosageForm || null,
          route:        item.route || null,
          eye:          item.eye || null,
          dose:         item.dose || null,
          frequency:    item.frequency || null,
          duration:     item.duration || null,
          instructions: item.instructions || null,
          sortOrder:    item.sortOrder ?? i,
        })),
      },
    },
    select: RX_SELECT,
  });
}

export async function updatePrescription(rxId: string, doctorId: string, input: any) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: { doctorId: true, status: true } });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (rx.doctorId !== doctorId) throw new AppError("এই প্রেসক্রিপশনে আপনার অ্যাক্সেস নেই।", 403);
  if (rx.status === "FINALIZED") throw new AppError("চূড়ান্ত প্রেসক্রিপশন সম্পাদনা করা যাবে না।", 400);

  // Delete existing items and recreate
  await prisma.prescriptionItem.deleteMany({ where: { prescriptionId: rxId } });

  return prisma.prescription.update({
    where: { id: rxId },
    data: {
      rxType:         input.rxType,
      chiefComplaint: input.chiefComplaint || null,
      history:        input.history || null,
      allergies:      input.allergies || null,
      currentMeds:    input.currentMeds || null,
      vaRightEye:     input.vaRightEye || null,
      vaLeftEye:      input.vaLeftEye || null,
      refractionRE:   input.refractionRE || null,
      refractionLE:   input.refractionLE || null,
      iopRightEye:    input.iopRightEye || null,
      iopLeftEye:     input.iopLeftEye || null,
      examNotes:      input.examNotes || null,
      diagnosis:      input.diagnosis || null,
      investigations: input.investigations || null,
      instructions:   input.instructions || null,
      advice:         input.advice || null,
      doctorNotes:    input.doctorNotes || null,
      followUpDate:   input.followUpDate ? new Date(input.followUpDate) : null,
      followUpNote:   input.followUpNote || null,
      spectacleData:  input.spectacleData || null,
      items: {
        create: (input.items || []).map((item: any, i: number) => ({
          medicineName: item.medicineName,
          strength:     item.strength || null,
          dosageForm:   item.dosageForm || null,
          route:        item.route || null,
          eye:          item.eye || null,
          dose:         item.dose || null,
          frequency:    item.frequency || null,
          duration:     item.duration || null,
          instructions: item.instructions || null,
          sortOrder:    item.sortOrder ?? i,
        })),
      },
    },
    select: RX_SELECT,
  });
}

export async function finalizePrescription(rxId: string, doctorId: string, finalizedBy: string, ctx?: AuditContext) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: { doctorId: true, status: true } });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (rx.doctorId !== doctorId) throw new AppError("শুধুমাত্র প্রেসক্রাইবিং ডাক্তার চূড়ান্ত করতে পারবেন।", 403);
  if (rx.status === "FINALIZED") throw new AppError("ইতিমধ্যে চূড়ান্ত করা হয়েছে।", 400);

  // Get full data for snapshot
  const full = await prisma.prescription.findUnique({ where: { id: rxId }, select: RX_SELECT });
  const settings = await getDoctorSettings(doctorId);

  const updated = await prisma.prescription.update({
    where: { id: rxId },
    data: {
      status:         "FINALIZED",
      finalizedAt:    new Date(),
      finalizedBy,
      doctorSnapshot: settings as any,
      snapshot:       full as any,
    },
    select: RX_SELECT,
  });

  if (ctx) writeAudit({ ctx, action: "STATUS_CHANGE", module: "prescription", recordId: rxId, recordLabel: `${full?.rxNo} — চূড়ান্ত` });
  return updated;
}

export async function amendPrescription(rxId: string, doctorId: string, reason: string, newData: any, amendedBy: string, ctx?: AuditContext) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: { doctorId: true, status: true } });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (rx.doctorId !== doctorId) throw new AppError("অ্যাক্সেস নেই।", 403);
  if (rx.status !== "FINALIZED") throw new AppError("শুধুমাত্র চূড়ান্ত প্রেসক্রিপশন সংশোধন করা যাবে।", 400);

  const snapshot = await prisma.prescription.findUnique({ where: { id: rxId }, select: RX_SELECT });

  await prisma.prescriptionAmendment.create({
    data: { prescriptionId: rxId, reason, amendedBy, snapshot: snapshot as any },
  });

  // Reopen as draft with new data
  await prisma.prescriptionItem.deleteMany({ where: { prescriptionId: rxId } });

  const updated = await prisma.prescription.update({
    where: { id: rxId },
    data: {
      status: "DRAFT",
      finalizedAt: null,
      finalizedBy: null,
      snapshot: null,
      doctorSnapshot: null,
      ...newData,
      items: {
        create: (newData.items || []).map((item: any, i: number) => ({
          medicineName: item.medicineName,
          strength: item.strength || null,
          dosageForm: item.dosageForm || null,
          route: item.route || null,
          eye: item.eye || null,
          dose: item.dose || null,
          frequency: item.frequency || null,
          duration: item.duration || null,
          instructions: item.instructions || null,
          sortOrder: item.sortOrder ?? i,
        })),
      },
    },
    select: RX_SELECT,
  });

  if (ctx) writeAudit({ ctx, action: "UPDATE", module: "prescription", recordId: rxId, recordLabel: `সংশোধন: ${reason}` });
  return updated;
}

export async function getPrescription(rxId: string, doctorId?: string) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: RX_SELECT });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (doctorId && rx.doctor?.id !== doctorId) throw new AppError("অ্যাক্সেস নেই।", 403);
  return rx;
}

export async function listPrescriptions(query: {
  doctorId?: string; patientId?: string; status?: string; rxType?: string;
  search?: string; page: number; limit: number;
}) {
  const where: any = {};
  if (query.doctorId)  where.doctorId  = query.doctorId;
  if (query.patientId) where.patientId = query.patientId;
  if (query.status)    where.status    = query.status;
  if (query.rxType)    where.rxType    = query.rxType;
  if (query.search) {
    const s = query.search.trim();
    where.OR = [
      { rxNo:    { contains: s, mode: "insensitive" } },
      { patient: { nameBn: { contains: s, mode: "insensitive" } } },
      { patient: { nameEn: { contains: s, mode: "insensitive" } } },
      { patient: { phone:  { contains: s } } },
      { patient: { patientId: { contains: s, mode: "insensitive" } } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.prescription.count({ where }),
    prisma.prescription.findMany({
      where, skip, take: query.limit,
      select: RX_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function deleteDraftPrescription(rxId: string, doctorId: string) {
  const rx = await prisma.prescription.findUnique({ where: { id: rxId }, select: { doctorId: true, status: true } });
  if (!rx) throw new AppError("প্রেসক্রিপশন পাওয়া যায়নি।", 404);
  if (rx.doctorId !== doctorId) throw new AppError("অ্যাক্সেস নেই।", 403);
  if (rx.status === "FINALIZED") throw new AppError("চূড়ান্ত প্রেসক্রিপশন মুছা যাবে না।", 400);
  return prisma.prescription.delete({ where: { id: rxId } });
}
