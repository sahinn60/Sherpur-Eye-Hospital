import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required").max(128),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email:    z.string().email("Invalid email address").toLowerCase().trim(),
  password: passwordSchema,
  // SUPER_ADMIN cannot be assigned via API — silently downgraded in service
  role: z
    .enum(["ADMIN", "HR", "DOCTOR", "RECEPTION", "ACCOUNTANT", "EMPLOYEE"])
    .optional()
    .default("EMPLOYEE"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(128),
  newPassword:     passwordSchema,
});

export type LoginInput          = z.infer<typeof loginSchema>;
export type RegisterInput       = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
