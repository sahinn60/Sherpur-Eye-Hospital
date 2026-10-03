import { z } from "zod";

const SERVICE_CATEGORIES = [
  "GENERAL", "CATARACT", "PHACO", "GLAUCOMA", "RETINA",
  "CORNEA", "PEDIATRIC", "DIABETIC", "EXAMINATION", "OTHER",
] as const;

export const createServiceSchema = z.object({
  category: z.enum(SERVICE_CATEGORIES).default("OTHER"),
  nameBn: z.string().min(2),
  nameEn: z.string().min(2),
  shortDescBn: z.string().min(5),
  shortDescEn: z.string().min(5),
  fullDescBn: z.string().min(10),
  fullDescEn: z.string().min(10),
  icon: z.string().default("👁️"),
  image: z.string().url().optional(),
  doctorId: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
