import { z } from "zod";

export const upsertSettingsSchema = z.object({
  settings: z.record(z.string(), z.string()),
});

export const updateSectionSchema = z.object({
  isVisible: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const bulkUpdateSectionsSchema = z.object({
  sections: z.array(
    z.object({
      key: z.string(),
      isVisible: z.boolean().optional(),
      sortOrder: z.number().int().optional(),
    })
  ),
});

export const createNoticeSchema = z.object({
  textBn:    z.string().min(1),
  textEn:    z.string().default(""),
  link:      z.string().url().optional().or(z.literal("")),
  isActive:  z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const updateNoticeSchema = createNoticeSchema.partial();
