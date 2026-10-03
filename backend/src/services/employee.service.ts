import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import {
  CreateEmployeeInput, UpdateEmployeeInput,
  AssignAccountInput, AssignShiftInput,
} from "../validators/employee.validator";

const ADMIN_SELECT = {
  id: true, employeeId: true, nameBn: true, nameEn: true, photo: true,
  phone: true, email: true, gender: true, dateOfBirth: true,
  designationBn: true, designationEn: true,
  joiningDate: true, address: true,
  basicSalary: true, allowances: true, deductions: true,
  isActive: true, createdAt: true,
  department: { select: { id: true, name: true } },
  shift:      { select: { id: true, name: true, startTime: true, endTime: true } },
  user:       { select: { id: true, email: true, role: true, isActive: true, lastLoginAt: true } },
};

const SELF_SELECT = {
  id: true, employeeId: true, nameBn: true, nameEn: true, photo: true,
  phone: true, email: true, gender: true, dateOfBirth: true,
  designationBn: true, designationEn: true,
  joiningDate: true, address: true,
  isActive: true,
  department: { select: { id: true, name: true } },
  shift:      { select: { id: true, name: true, startTime: true, endTime: true } },
};

async function generateEmployeeId(): Promise<string> {
  const last = await prisma.employee.findFirst({
    orderBy: { createdAt: "desc" },
    select: { employeeId: true },
  });
  if (!last) return "EMP-0001";
  const num = parseInt(last.employeeId.split("-")[1] || "0", 10);
  return `EMP-${String(num + 1).padStart(4, "0")}`;
}

export async function listEmployees(query: {
  page?: number; limit?: number; search?: string;
  departmentId?: string; shiftId?: string; isActive?: string;
}) {
  const page  = Math.max(1, query.page  || 1);
  const limit = Math.min(50, query.limit || 20);
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (query.search) {
    where.OR = [
      { nameBn:      { contains: query.search, mode: "insensitive" } },
      { nameEn:      { contains: query.search, mode: "insensitive" } },
      { phone:       { contains: query.search } },
      { employeeId:  { contains: query.search, mode: "insensitive" } },
      { designationBn: { contains: query.search, mode: "insensitive" } },
    ];
  }
  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.shiftId)      where.shiftId      = query.shiftId;
  if (query.isActive !== undefined) where.isActive = query.isActive === "true";

  const [total, items] = await Promise.all([
    prisma.employee.count({ where }),
    prisma.employee.findMany({
      where, skip, take: limit,
      select: ADMIN_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getEmployeeById(id: string, selfUserId?: string) {
  const emp = await prisma.employee.findUnique({ where: { id }, select: ADMIN_SELECT });
  if (!emp) throw new AppError("Employee not found", 404);

  // If selfUserId provided, only allow own record
  if (selfUserId && emp.user?.id !== selfUserId) {
    throw new AppError("Access denied", 403);
  }
  return emp;
}

export async function getMyEmployee(userId: string) {
  const emp = await prisma.employee.findFirst({
    where: { userId },
    select: SELF_SELECT,
  });
  if (!emp) throw new AppError("Employee record not found", 404);
  return emp;
}

export async function createEmployee(input: CreateEmployeeInput) {
  const employeeId = await generateEmployeeId();
  return prisma.employee.create({
    data: {
      employeeId,
      nameBn:        input.nameBn,
      nameEn:        input.nameEn,
      phone:         input.phone,
      email:         input.email || null,
      gender:        input.gender as any,
      dateOfBirth:   input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      departmentId:  input.departmentId || null,
      designationBn: input.designationBn,
      designationEn: input.designationEn,
      shiftId:       input.shiftId || null,
      joiningDate:   input.joiningDate ? new Date(input.joiningDate) : new Date(),
      address:       input.address || null,
      basicSalary:   input.basicSalary,
      allowances:    input.allowances,
      deductions:    input.deductions,
      photo:         input.photo || null,
    },
    select: ADMIN_SELECT,
  });
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) throw new AppError("Employee not found", 404);

  return prisma.employee.update({
    where: { id },
    data: {
      ...(input.nameBn        !== undefined && { nameBn: input.nameBn }),
      ...(input.nameEn        !== undefined && { nameEn: input.nameEn }),
      ...(input.phone         !== undefined && { phone: input.phone }),
      ...(input.email         !== undefined && { email: input.email || null }),
      ...(input.gender        !== undefined && { gender: input.gender as any }),
      ...(input.dateOfBirth   !== undefined && { dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null }),
      ...(input.departmentId  !== undefined && { departmentId: input.departmentId || null }),
      ...(input.designationBn !== undefined && { designationBn: input.designationBn }),
      ...(input.designationEn !== undefined && { designationEn: input.designationEn }),
      ...(input.shiftId       !== undefined && { shiftId: input.shiftId || null }),
      ...(input.joiningDate   !== undefined && { joiningDate: new Date(input.joiningDate) }),
      ...(input.address       !== undefined && { address: input.address || null }),
      ...(input.basicSalary   !== undefined && { basicSalary: input.basicSalary }),
      ...(input.allowances    !== undefined && { allowances: input.allowances }),
      ...(input.deductions    !== undefined && { deductions: input.deductions }),
      ...(input.photo         !== undefined && { photo: input.photo || null }),
    },
    select: ADMIN_SELECT,
  });
}

export async function toggleEmployeeStatus(id: string) {
  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) throw new AppError("Employee not found", 404);
  const updated = await prisma.employee.update({
    where: { id },
    data: { isActive: !emp.isActive },
    select: ADMIN_SELECT,
  });
  // Also toggle linked user account
  if (emp.userId) {
    await prisma.user.update({ where: { id: emp.userId }, data: { isActive: !emp.isActive } });
  }
  return updated;
}

export async function assignShift(id: string, input: AssignShiftInput) {
  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) throw new AppError("Employee not found", 404);
  const shift = await prisma.shift.findUnique({ where: { id: input.shiftId } });
  if (!shift) throw new AppError("Shift not found", 404);
  return prisma.employee.update({
    where: { id },
    data: { shiftId: input.shiftId },
    select: ADMIN_SELECT,
  });
}

export async function assignLoginAccount(id: string, input: AssignAccountInput) {
  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) throw new AppError("Employee not found", 404);
  if (emp.userId) throw new AppError("Employee already has a login account", 409);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email already in use", 409);

  const hashed = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: { name: emp.nameEn, email: input.email, password: hashed, role: input.role as any },
  });
  return prisma.employee.update({
    where: { id },
    data: { userId: user.id },
    select: ADMIN_SELECT,
  });
}

export async function listDepartments() {
  return prisma.department.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

export async function listShifts() {
  return prisma.shift.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}
