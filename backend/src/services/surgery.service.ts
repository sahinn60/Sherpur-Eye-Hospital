import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { z } from "zod";

export const createSurgerySchema = z.object({
  patientId:   z.string().min(1),
  doctorId:    z.string().min(1),
  surgeryType: z.string().min(1),
  otDate:      z.string().min(1),
  otTime:      z.string().min(1),
  status:      z.enum(["SCHEDULED","CONFIRMED","COMPLETED","CANCELLED"]).optional(),
  preOpNotes:  z.string().optional(),
  postOpNotes: z.string().optional(),
  followUpDate:z.string().optional(),
  anaesthesia: z.string().optional(),
  eye:         z.string().optional(),
  notes:       z.string().optional(),
});

export const updateSurgerySchema = createSurgerySchema.partial();

export type CreateSurgeryInput = z.infer<typeof createSurgerySchema>;
export type UpdateSurgeryInput = z.infer<typeof updateSurgerySchema>;

const SURGERY_SELECT = {
  id: true, surgeryNo: true, surgeryType: true,
  otDate: true, otTime: true, status: true,
  preOpNotes: true, postOpNotes: true, followUpDate: true,
  anaesthesia: true, eye: true, notes: true,
  createdAt: true, updatedAt: true,
  patient: { select: { id: true, patientId: true, nameBn: true, nameEn: true, phone: true, age: true, gender: true } },
  doctor:  { select: { id: true, nameBn: true, nameEn: true, designationBn: true } },
};

async function generateSurgeryNo(): Promise<string> {
  const year  = new Date().getFullYear();
  const count = await prisma.surgery.count();
  return `SRG-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function listSurgeries(query: {
  status?: string; doctorId?: string; dateFrom?: string; dateTo?: string;
  search?: string; page: number; limit: number;
}) {
  const where: any = {};
  if (query.status)   where.status   = query.status;
  if (query.doctorId) where.doctorId = query.doctorId;
  if (query.dateFrom || query.dateTo) {
    where.otDate = {};
    if (query.dateFrom) where.otDate.gte = new Date(query.dateFrom);
    if (query.dateTo)   where.otDate.lte = new Date(query.dateTo);
  }
  if (query.search) {
    where.OR = [
      { surgeryType: { contains: query.search, mode: "insensitive" } },
      { patient: { nameBn: { contains: query.search, mode: "insensitive" } } },
      { patient: { phone:  { contains: query.search } } },
      { surgeryNo: { contains: query.search, mode: "insensitive" } },
    ];
  }
  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.surgery.count({ where }),
    prisma.surgery.findMany({ where, skip, take: query.limit, select: SURGERY_SELECT, orderBy: { otDate: "desc" } }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getSurgery(id: string) {
  const s = await prisma.surgery.findUnique({ where: { id }, select: SURGERY_SELECT });
  if (!s) throw new AppError("Surgery not found", 404);
  return s;
}

export async function createSurgery(input: CreateSurgeryInput, createdBy: string) {
  const surgeryNo = await generateSurgeryNo();
  return prisma.surgery.create({
    data: {
      surgeryNo,
      patientId:    input.patientId,
      doctorId:     input.doctorId,
      surgeryType:  input.surgeryType,
      otDate:       new Date(input.otDate),
      otTime:       input.otTime,
      status:       (input.status as any) || "SCHEDULED",
      preOpNotes:   input.preOpNotes  || null,
      postOpNotes:  input.postOpNotes || null,
      followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
      anaesthesia:  input.anaesthesia || null,
      eye:          input.eye         || null,
      notes:        input.notes       || null,
      createdBy,
    },
    select: SURGERY_SELECT,
  });
}

export async function updateSurgery(id: string, input: UpdateSurgeryInput) {
  const existing = await prisma.surgery.findUnique({ where: { id } });
  if (!existing) throw new AppError("Surgery not found", 404);
  return prisma.surgery.update({
    where: { id },
    data: {
      ...(input.patientId    ? { patientId:    input.patientId }    : {}),
      ...(input.doctorId     ? { doctorId:     input.doctorId }     : {}),
      ...(input.surgeryType  ? { surgeryType:  input.surgeryType }  : {}),
      ...(input.otDate       ? { otDate:       new Date(input.otDate) } : {}),
      ...(input.otTime       ? { otTime:       input.otTime }       : {}),
      ...(input.status       ? { status:       input.status as any } : {}),
      ...(input.preOpNotes  !== undefined ? { preOpNotes:  input.preOpNotes  || null } : {}),
      ...(input.postOpNotes !== undefined ? { postOpNotes: input.postOpNotes || null } : {}),
      ...(input.followUpDate !== undefined ? { followUpDate: input.followUpDate ? new Date(input.followUpDate) : null } : {}),
      ...(input.anaesthesia !== undefined ? { anaesthesia: input.anaesthesia || null } : {}),
      ...(input.eye         !== undefined ? { eye:         input.eye         || null } : {}),
      ...(input.notes       !== undefined ? { notes:       input.notes       || null } : {}),
    },
    select: SURGERY_SELECT,
  });
}

export async function deleteSurgery(id: string) {
  const existing = await prisma.surgery.findUnique({ where: { id } });
  if (!existing) throw new AppError("Surgery not found", 404);
  await prisma.surgery.delete({ where: { id } });
}
