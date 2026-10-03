import { z } from "zod";

export const checkInSchema = z.object({
  selfie:    z.string().optional(),   // base64 data URL
  latitude:  z.number().optional(),
  longitude: z.number().optional(),
});

export const checkOutSchema = z.object({
  selfie:    z.string().optional(),
  latitude:  z.number().optional(),
  longitude: z.number().optional(),
});

export const adminListSchema = z.object({
  userId:   z.string().optional(),
  date:     z.string().optional(),   // YYYY-MM-DD
  dateFrom: z.string().optional(),
  dateTo:   z.string().optional(),
  status:   z.string().optional(),
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(100).default(30),
});

export type CheckInInput    = z.infer<typeof checkInSchema>;
export type CheckOutInput   = z.infer<typeof checkOutSchema>;
export type AdminListInput  = z.infer<typeof adminListSchema>;
