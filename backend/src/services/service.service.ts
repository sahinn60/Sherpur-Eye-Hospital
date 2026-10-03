import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CreateServiceInput, UpdateServiceInput } from "../validators/service.validator";

const DOCTOR_SELECT = {
  id: true,
  nameBn: true,
  nameEn: true,
  designationBn: true,
  designationEn: true,
  photo: true,
};

const PUBLIC_SELECT = {
  id: true,
  category: true,
  nameBn: true,
  nameEn: true,
  shortDescBn: true,
  shortDescEn: true,
  fullDescBn: true,
  fullDescEn: true,
  icon: true,
  image: true,
  sortOrder: true,
  doctor: { select: DOCTOR_SELECT },
};

export async function getAllServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    select: PUBLIC_SELECT,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findFirst({
    where: { id, isActive: true },
    select: PUBLIC_SELECT,
  });
  if (!service) throw new AppError("Service not found", 404);
  return service;
}

export async function createService(input: CreateServiceInput) {
  return prisma.service.create({ data: input, select: PUBLIC_SELECT });
}

export async function updateService(id: string, input: UpdateServiceInput) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found", 404);
  return prisma.service.update({ where: { id }, data: input, select: PUBLIC_SELECT });
}

export async function deleteService(id: string) {
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) throw new AppError("Service not found", 404);
  await prisma.service.update({ where: { id }, data: { isActive: false } });
}
