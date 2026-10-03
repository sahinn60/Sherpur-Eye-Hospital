import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/response";
import { LoginInput, RegisterInput, ChangePasswordInput } from "../validators/auth.validator";
import { config } from "../config/env";
import { Response } from "express";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.cookie.secure,
  sameSite: (config.env === "production" ? "strict" : "lax") as "strict" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

async function getUserWithPermissions(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      permissions: {
        select: { permission: { select: { key: true } } },
      },
    },
  });
}

export async function loginService(input: LoginInput, res: Response) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check account lock
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      423
    );
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated. Contact the administrator.", 403);
  }

  const passwordValid = await bcrypt.compare(input.password, user.password);

  if (!passwordValid) {
    const newAttempts = user.loginAttempts + 1;
    const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: newAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
      },
    });

    if (shouldLock) {
      throw new AppError(
        `Too many failed attempts. Account locked for 15 minutes.`,
        423
      );
    }

    const remaining = MAX_LOGIN_ATTEMPTS - newAttempts;
    throw new AppError(
      `Invalid email or password. ${remaining} attempt(s) remaining.`,
      401
    );
  }

  // Successful login — reset attempts
  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const token = signToken(user.id, user.role as any);
  res.cookie("token", token, COOKIE_OPTIONS);

  const fullUser = await getUserWithPermissions(user.id);
  return {
    id: fullUser!.id,
    email: fullUser!.email,
    name: fullUser!.name,
    role: fullUser!.role,
    permissions: fullUser!.permissions.map((p) => p.permission.key),
  };
}

export async function getMeService(userId: string) {
  const user = await getUserWithPermissions(userId);
  if (!user) throw new AppError("User not found", 404);
  if (!user.isActive) throw new AppError("Account deactivated", 403);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions.map((p) => p.permission.key),
  };
}

// Roles that can be assigned via the register endpoint (SUPER_ADMIN is never assignable via API)
const ASSIGNABLE_ROLES = ["ADMIN", "HR", "DOCTOR", "RECEPTION", "ACCOUNTANT", "EMPLOYEE"] as const;

export async function registerService(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new AppError("Email already in use", 409);

  // Prevent SUPER_ADMIN from being created via API
  const role = (input.role === undefined ? "EMPLOYEE" : input.role) as string;
  if (!ASSIGNABLE_ROLES.includes(role as any)) {
    throw new AppError("Invalid role", 400);
  }

  const hashed = await bcrypt.hash(input.password, 12);

  return prisma.user.create({
    data: {
      name:  input.name,
      email: input.email.toLowerCase().trim(),
      password: hashed,
      role: role as any,
    },
    select: { id: true, email: true, name: true, role: true },
  });
}

export async function changePasswordService(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const valid = await bcrypt.compare(input.currentPassword, user.password);
  if (!valid) throw new AppError("Current password is incorrect", 401);

  const hashed = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
}

export function logoutService(res: Response) {
  res.clearCookie("token", COOKIE_OPTIONS);
}

export async function listUsersService(query: { search?: string; role?: string; page: number; limit: number }) {
  const where: any = {};
  if (query.role) where.role = query.role;
  if (query.search) {
    where.OR = [
      { name:  { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }
  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where, skip, take: query.limit,
      select: { id: true, name: true, email: true, role: true, isActive: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

export async function toggleUserStatusService(userId: string, requesterId: string) {
  if (userId === requesterId) throw new AppError("নিজের অ্যাকাউন্ট নিষ্ক্রিয় করা যাবে না।", 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
}

const VALID_ROLES = ["SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTION", "ACCOUNTANT", "EMPLOYEE"];

export async function updateUserRoleService(userId: string, role: string, requesterId: string) {
  if (userId === requesterId) throw new AppError("নিজের রোল পরিবর্তন করা যাবে না।", 400);
  if (!VALID_ROLES.includes(role)) throw new AppError("Invalid role", 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  return prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
}
