import { z } from "zod";

export const createGalleryImageSchema = z.object({
  titleBn: z.string().min(1),
  titleEn: z.string().min(1),
  category: z.enum(["HOSPITAL", "DOCTORS", "FACILITIES", "EVENTS", "OTHER"]).default("OTHER"),
  imageUrl: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().int().default(0),
  height: z.number().int().default(0),
  sortOrder: z.number().int().default(0),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial();

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
