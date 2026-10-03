import { z } from "zod";

export const applyLeaveSchema = z.object({
  leaveType:  z.enum(["CASUAL","SICK","ANNUAL","MATERNITY","PATERNITY","UNPAID","EMERGENCY","OTHER"]),
  startDate:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD format required"),
  endDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD format required"),
  reason:     z.string().min(5, "কারণ লিখুন"),
  attachment: z.string().url().optional().or(z.literal("")),
});

export const reviewLeaveSchema = z.object({
  status:     z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().optional(),
});

export type ApplyLeaveInput  = z.infer<typeof applyLeaveSchema>;
export type ReviewLeaveInput = z.infer<typeof reviewLeaveSchema>;
