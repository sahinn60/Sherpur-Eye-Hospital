import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import {
  CreateDoctorInput, UpdateDoctorInput, AssignDoctorAccountInput,
} from "../validators/doctor.validator";

// ─── Selects ────────────────────────────────────────────────────────────────

const PUBLIC_SELECT = {
  id: true, nameBn: true, nameEn: true, photo: true,
  designationBn: true, designationEn: true,
  qualificationBn: true, qualificationEn: true,
  specialtyBn: true, specialtyEn: true,
  specializations: true,
  experienceBn: true, experienceEn: true,
  biographyBn: true, biographyEn: true,
  consultationFee: true, availableDays: true,
  chamberSchedule: true, schedule: true,
  sortOrder: true, isActive: true,
};

const ADMIN_SELECT = {
  ...PUBLIC_SELECT,
  phone: true, email: true, gender: true,
  dateOfBirth: true, joiningDate: true,
  createdAt: true, updatedAt: true,
  user: {
    select: {
      id: true, email: true, role: true,
      isActive: true, lastLoginAt: true,
    },
  },
};

// ─── Public ──────────────────────────────────────────────────────────────────

export async function getAllDoctors() {
  return prisma.doctor.findMany({
    where: { isActive: true },
    select: PUBLIC_SELECT,
    orderBy: { sortOrder: "asc" },
  });
}

export async function getDoctorById(id: string) {
  const doctor = await prisma.doctor.findFirst({
    where: { id, isActive: true },
    select: PUBLIC_SELECT,
  });
  if (!doctor) throw new AppError("Doctor not found", 404);
  return doctor;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export async function listAllDoctors(query: {
  page?: number; limit?: number; search?: string; isActive?: string;
}) {
  const page  = Math.max(1, query.page  || 1);
  const limit = Math.min(50, query.limit || 20);
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (query.search) {
    where.OR = [
      { nameBn:       { contains: query.search, mode: "insensitive" } },
      { nameEn:       { contains: query.search, mode: "insensitive" } },
      { specialtyEn:  { contains: query.search, mode: "insensitive" } },
      { designationEn:{ contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.isActive !== undefined) where.isActive = query.isActive === "true";

  const [total, items] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where, skip, take: limit,
      select: ADMIN_SELECT,
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getDoctorByIdAdmin(id: string) {
  const doctor = await prisma.doctor.findUnique({ where: { id }, select: ADMIN_SELECT });
  if (!doctor) throw new AppError("Doctor not found", 404);
  return doctor;
}

export async function createDoctor(input: CreateDoctorInput) {
  if (input.email) {
    const exists = await prisma.doctor.findFirst({ where: { email: input.email } });
    if (exists) throw new AppError("Email already in use", 409);
  }
  return prisma.doctor.create({
    data: {
      nameBn:          input.nameBn,
      nameEn:          input.nameEn,
      photo:           input.photo || null,
      phone:           input.phone || null,
      email:           input.email || null,
      gender:          input.gender as any,
      dateOfBirth:     input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      joiningDate:     input.joiningDate ? new Date(input.joiningDate) : new Date(),
      designationBn:   input.designationBn,
      designationEn:   input.designationEn,
      qualificationBn: input.qualificationBn,
      qualificationEn: input.qualificationEn,
      specialtyBn:     input.specialtyBn,
      specialtyEn:     input.specialtyEn,
      specializations: input.specializations,
      experienceBn:    input.experienceBn,
      experienceEn:    input.experienceEn,
      biographyBn:     input.biographyBn || null,
      biographyEn:     input.biographyEn || null,
      consultationFee: input.consultationFee,
      availableDays:   input.availableDays,
      chamberSchedule: input.chamberSchedule || null,
      schedule:        input.schedule as any,
      sortOrder:       input.sortOrder,
      ...(input.userId ? { userId: input.userId } : {}),
    },
    select: ADMIN_SELECT,
  });
}

export async function updateDoctor(id: string, input: UpdateDoctorInput) {
  const existing = await prisma.doctor.findUnique({ where: { id } });
  if (!existing) throw new AppError("Doctor not found", 404);

  return prisma.doctor.update({
    where: { id },
    data: {
      ...(input.nameBn          !== undefined && { nameBn: input.nameBn }),
      ...(input.nameEn          !== undefined && { nameEn: input.nameEn }),
      ...(input.photo           !== undefined && { photo: input.photo || null }),
      ...(input.phone           !== undefined && { phone: input.phone || null }),
      ...(input.email           !== undefined && { email: input.email || null }),
      ...(input.gender          !== undefined && { gender: input.gender as any }),
      ...(input.dateOfBirth     !== undefined && { dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null }),
      ...(input.joiningDate     !== undefined && { joiningDate: new Date(input.joiningDate) }),
      ...(input.designationBn   !== undefined && { designationBn: input.designationBn }),
      ...(input.designationEn   !== undefined && { designationEn: input.designationEn }),
      ...(input.qualificationBn !== undefined && { qualificationBn: input.qualificationBn }),
      ...(input.qualificationEn !== undefined && { qualificationEn: input.qualificationEn }),
      ...(input.specialtyBn     !== undefined && { specialtyBn: input.specialtyBn }),
      ...(input.specialtyEn     !== undefined && { specialtyEn: input.specialtyEn }),
      ...(input.specializations !== undefined && { specializations: input.specializations }),
      ...(input.experienceBn    !== undefined && { experienceBn: input.experienceBn }),
      ...(input.experienceEn    !== undefined && { experienceEn: input.experienceEn }),
      ...(input.biographyBn     !== undefined && { biographyBn: input.biographyBn || null }),
      ...(input.biographyEn     !== undefined && { biographyEn: input.biographyEn || null }),
      ...(input.consultationFee !== undefined && { consultationFee: input.consultationFee }),
      ...(input.availableDays   !== undefined && { availableDays: input.availableDays }),
      ...(input.chamberSchedule !== undefined && { chamberSchedule: input.chamberSchedule || null }),
      ...(input.schedule        !== undefined && { schedule: input.schedule as any }),
      ...(input.sortOrder       !== undefined && { sortOrder: input.sortOrder }),
    },
    select: ADMIN_SELECT,
  });
}

export async function toggleDoctorStatus(id: string) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) throw new AppError("Doctor not found", 404);
  const updated = await prisma.doctor.update({
    where: { id },
    data: { isActive: !doctor.isActive },
    select: ADMIN_SELECT,
  });
  if (doctor.userId) {
    await prisma.user.update({
      where: { id: doctor.userId },
      data: { isActive: !doctor.isActive },
    });
  }
  return updated;
}

export async function assignDoctorAccount(id: string, input: AssignDoctorAccountInput) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) throw new AppError("Doctor not found", 404);
  if (doctor.userId) throw new AppError("Doctor already has a login account", 409);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email already in use", 409);

  const hashed = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: doctor.nameEn, email: input.email, password: hashed, role: "DOCTOR" },
  });
  return prisma.doctor.update({
    where: { id },
    data: { userId: user.id },
    select: ADMIN_SELECT,
  });
}

export async function deleteDoctor(id: string) {
  const existing = await prisma.doctor.findUnique({ where: { id } });
  if (!existing) throw new AppError("Doctor not found", 404);
  await prisma.doctor.update({ where: { id }, data: { isActive: false } });
}
