import { z } from "zod";

export const createEmployeeSchema = z.object({
  nameBn:        z.string().min(2),
  nameEn:        z.string().min(2),
  phone:         z.string().min(10),
  email:         z.string().email().optional().or(z.literal("")),
  gender:        z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
  dateOfBirth:   z.string().datetime().optional().or(z.literal("")),
  departmentId:  z.string().optional(),
  designationBn: z.string().min(2),
  designationEn: z.string().min(2),
  shiftId:       z.string().optional(),
  joiningDate:   z.string().datetime().optional(),
  address:       z.string().optional(),
  basicSalary:   z.number().min(0).default(0),
  allowances:    z.number().min(0).default(0),
  deductions:    z.number().min(0).default(0),
  photo:         z.string().url().optional().or(z.literal("")),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const assignAccountSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  role:     z.enum(["DOCTOR","RECEPTION","ACCOUNTANT","HR","EMPLOYEE"]).default("EMPLOYEE"),
});

export const assignShiftSchema = z.object({
  shiftId: z.string().min(1),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type AssignAccountInput  = z.infer<typeof assignAccountSchema>;
export type AssignShiftInput    = z.infer<typeof assignShiftSchema>;
