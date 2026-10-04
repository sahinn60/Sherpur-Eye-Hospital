import { prisma } from "../config/database";
import { AppError } from "../utils/response";

const TEMPLATE_SELECT = {
  id: true, name: true, nameBn: true, category: true,
  diagnosis: true, advice: true, instructions: true,
  isShared: true, doctorId: true, createdBy: true,
  createdAt: true, updatedAt: true,
  items: {
    select: {
      id: true, medicineName: true, strength: true, dosageForm: true,
      eye: true, dose: true, frequency: true, duration: true,
      instructions: true, sortOrder: true,
    },
    orderBy: { sortOrder: "asc" as const },
  },
};

export async function listTemplates(query: {
  doctorId?: string; search?: string; category?: string;
  isShared?: boolean; page: number; limit: number;
}) {
  const where: any = {
    OR: [
      { isShared: true },
      ...(query.doctorId ? [{ doctorId: query.doctorId }] : []),
    ],
  };
  if (query.category) where.category = query.category;
  if (query.search) {
    where.AND = [{ OR: [
      { name:   { contains: query.search, mode: "insensitive" } },
      { nameBn: { contains: query.search, mode: "insensitive" } },
    ]}];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.prescriptionTemplate.count({ where }),
    prisma.prescriptionTemplate.findMany({
      where, skip, take: query.limit,
      select: TEMPLATE_SELECT,
      orderBy: [{ isShared: "desc" }, { createdAt: "desc" }],
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function getTemplate(id: string, doctorId?: string) {
  const t = await prisma.prescriptionTemplate.findUnique({ where: { id }, select: TEMPLATE_SELECT });
  if (!t) throw new AppError("টেমপ্লেট পাওয়া যায়নি।", 404);
  if (!t.isShared && doctorId && t.doctorId !== doctorId)
    throw new AppError("এই টেমপ্লেটে আপনার অ্যাক্সেস নেই।", 403);
  return t;
}

export async function createTemplate(doctorId: string, createdBy: string, input: any) {
  return prisma.prescriptionTemplate.create({
    data: {
      name:         input.name,
      nameBn:       input.nameBn,
      category:     input.category || "GENERAL",
      diagnosis:    input.diagnosis || null,
      advice:       input.advice || null,
      instructions: input.instructions || null,
      isShared:     input.isShared ?? false,
      doctorId,
      createdBy,
      items: {
        create: (input.items || []).map((item: any, i: number) => ({
          medicineName: item.medicineName,
          strength:     item.strength || null,
          dosageForm:   item.dosageForm || null,
          eye:          item.eye || null,
          dose:         item.dose || null,
          frequency:    item.frequency || null,
          duration:     item.duration || null,
          instructions: item.instructions || null,
          sortOrder:    item.sortOrder ?? i,
        })),
      },
    },
    select: TEMPLATE_SELECT,
  });
}

export async function updateTemplate(id: string, doctorId: string, input: any) {
  const t = await prisma.prescriptionTemplate.findUnique({ where: { id }, select: { doctorId: true } });
  if (!t) throw new AppError("টেমপ্লেট পাওয়া যায়নি।", 404);
  if (t.doctorId !== doctorId) throw new AppError("এই টেমপ্লেট সম্পাদনার অনুমতি নেই।", 403);

  await prisma.prescriptionTemplateItem.deleteMany({ where: { templateId: id } });

  return prisma.prescriptionTemplate.update({
    where: { id },
    data: {
      name:         input.name,
      nameBn:       input.nameBn,
      category:     input.category || "GENERAL",
      diagnosis:    input.diagnosis || null,
      advice:       input.advice || null,
      instructions: input.instructions || null,
      isShared:     input.isShared ?? false,
      items: {
        create: (input.items || []).map((item: any, i: number) => ({
          medicineName: item.medicineName,
          strength:     item.strength || null,
          dosageForm:   item.dosageForm || null,
          eye:          item.eye || null,
          dose:         item.dose || null,
          frequency:    item.frequency || null,
          duration:     item.duration || null,
          instructions: item.instructions || null,
          sortOrder:    item.sortOrder ?? i,
        })),
      },
    },
    select: TEMPLATE_SELECT,
  });
}

export async function deleteTemplate(id: string, doctorId: string, isAdmin: boolean) {
  const t = await prisma.prescriptionTemplate.findUnique({ where: { id }, select: { doctorId: true } });
  if (!t) throw new AppError("টেমপ্লেট পাওয়া যায়নি।", 404);
  if (!isAdmin && t.doctorId !== doctorId) throw new AppError("মুছে ফেলার অনুমতি নেই।", 403);
  return prisma.prescriptionTemplate.delete({ where: { id } });
}
