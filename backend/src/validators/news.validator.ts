import { z } from "zod";

export const createNewsArticleSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  titleBn: z.string().min(2),
  titleEn: z.string().min(2),
  shortDescBn: z.string().min(5),
  shortDescEn: z.string().min(5),
  contentBn: z.string().min(10),
  contentEn: z.string().min(10),
  featuredImage: z.string().url().optional(),
  imagePublicId: z.string().optional(),
  category: z.enum(["ANNOUNCEMENT", "HEALTH_TIPS", "EVENTS", "ACHIEVEMENTS", "OTHER"]).default("OTHER"),
  authorBn: z.string().default("হাসপাতাল কর্তৃপক্ষ"),
  authorEn: z.string().default("Hospital Authority"),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().datetime().optional(),
});

export const updateNewsArticleSchema = createNewsArticleSchema.partial();

export type CreateNewsArticleInput = z.infer<typeof createNewsArticleSchema>;
export type UpdateNewsArticleInput = z.infer<typeof updateNewsArticleSchema>;
