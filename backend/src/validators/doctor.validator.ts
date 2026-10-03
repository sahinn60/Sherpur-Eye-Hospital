import { z } from "zod";

const scheduleSlotSchema = z.object({
  dayBn:  z.string().min(1),
  dayEn:  z.string().min(1),
  timeBn: z.string().min(1),
  timeEn: z.string().min(1),
});

export const createDoctorSchema = z.object({
  nameBn:          z.string().min(2),
  nameEn:          z.string().min(2),
  photo:           z.string().url().optional().or(z.literal("")),
  phone:           z.string().optional(),
  email:           z.string().email().optional().or(z.literal("")),
  gender:          z.enum(["MALE", "FEMALE", "OTHER"]).default("MALE"),
  dateOfBirth:     z.string().optional(),
  joiningDate:     z.string().optional(),

  designationBn:   z.string().min(2),
  designationEn:   z.string().min(2),
  qualificationBn: z.string().min(2),
  qualificationEn: z.string().min(2),
  specialtyBn:     z.string().min(2),
  specialtyEn:     z.string().min(2),
  specializations: z.array(z.string()).default([]),
  experienceBn:    z.string().min(1),
  experienceEn:    z.string().min(1),
  biographyBn:     z.string().optional(),
  biographyEn:     z.string().optional(),

  consultationFee: z.coerce.number().min(0).default(0),
  availableDays:   z.array(z.string()).default([]),
  chamberSchedule: z.string().optional(),
  schedule:        z.array(scheduleSlotSchema).default([]),

  sortOrder:       z.coerce.number().int().default(0),
  userId:          z.string().optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export const assignDoctorAccountSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export type CreateDoctorInput        = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput        = z.infer<typeof updateDoctorSchema>;
export type AssignDoctorAccountInput = z.infer<typeof assignDoctorAccountSchema>;
