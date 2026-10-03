import { z } from "zod";

export const createIncomeSchema = z.object({
  category:    z.enum(["CONSULTATION","TEST","SURGERY","PROCEDURE","MEDICINE","OTHER"]).default("OTHER"),
  description: z.string().min(1, "বিবরণ দিন"),
  amount:      z.coerce.number().positive("পরিমাণ দিন"),
  invoiceId:   z.string().optional(),
  date:        z.string().min(1, "তারিখ দিন"),
  note:        z.string().optional(),
});

export const createExpenseSchema = z.object({
  category:    z.enum(["SALARY","EQUIPMENT","MEDICINE","ELECTRICITY","MAINTENANCE","RENT","CLEANING","FOOD","OTHER"]).default("OTHER"),
  description: z.string().min(1, "বিবরণ দিন"),
  amount:      z.coerce.number().positive("পরিমাণ দিন"),
  date:        z.string().min(1, "তারিখ দিন"),
  note:        z.string().optional(),
  attachment:  z.string().optional(),
});

export const dateRangeSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo:   z.string().optional(),
});

export type CreateIncomeInput  = z.infer<typeof createIncomeSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
