import { z } from "zod";

export const createPatientSchema = z.object({
  nameBn:           z.string().min(2, "বাংলা নাম দিন"),
  nameEn:           z.string().min(2, "English name required"),
  phone:            z.string().min(11, "সঠিক ফোন নম্বর দিন"),
  email:            z.string().email().optional().or(z.literal("")),
  age:              z.coerce.number().int().min(0).max(150).optional(),
  gender:           z.enum(["MALE", "FEMALE", "OTHER"]).default("OTHER"),
  address:          z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalHistory:   z.string().optional(),
  notes:            z.string().optional(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const createVisitSchema = z.object({
  appointmentId:  z.string().optional(),
  visitDate:      z.string().optional(),
  chiefComplaint: z.string().optional(),
  diagnosis:      z.string().optional(),
  treatment:      z.string().optional(),
  doctorId:       z.string().optional(),
  followUpDate:   z.string().optional(),
  notes:          z.string().optional(),
});

export const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "ওষুধের নাম দিন"),
  dose:         z.string().optional(),
  frequency:    z.string().optional(),
  duration:     z.string().optional(),
  instructions: z.string().optional(),
  sortOrder:    z.coerce.number().int().default(0),
});

export const createPrescriptionSchema = z.object({
  visitId:      z.string().optional(),
  doctorId:     z.string().optional(),
  diagnosis:    z.string().optional(),
  instructions: z.string().optional(),
  doctorNotes:  z.string().optional(),
  followUpDate: z.string().optional(),
  items:        z.array(prescriptionItemSchema).default([]),
});

export type CreatePatientInput      = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput      = z.infer<typeof updatePatientSchema>;
export type CreateVisitInput        = z.infer<typeof createVisitSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type PrescriptionItemInput   = z.infer<typeof prescriptionItemSchema>;
