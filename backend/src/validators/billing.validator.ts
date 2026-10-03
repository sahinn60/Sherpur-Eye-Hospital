import { z } from "zod";

export const invoiceItemSchema = z.object({
  type:        z.enum(["CONSULTATION","TEST","PROCEDURE","SURGERY","MEDICINE","OTHER"]).default("OTHER"),
  description: z.string().min(1, "বিবরণ দিন"),
  quantity:    z.coerce.number().int().min(1).default(1),
  unitPrice:   z.coerce.number().min(0),
  sortOrder:   z.coerce.number().int().default(0),
});

export const createInvoiceSchema = z.object({
  patientId:     z.string().optional(),
  patientName:   z.string().min(1, "রোগীর নাম দিন"),
  patientPhone:  z.string().min(1, "ফোন নম্বর দিন"),
  patientAge:    z.coerce.number().int().optional(),
  visitId:       z.string().optional(),
  appointmentId: z.string().optional(),
  doctorId:      z.string().optional(),
  discountType:  z.enum(["FLAT","PERCENT"]).default("FLAT"),
  discountValue: z.coerce.number().min(0).default(0),
  notes:         z.string().optional(),
  items:         z.array(invoiceItemSchema).min(1, "কমপক্ষে একটি আইটেম যোগ করুন"),
});

export const addPaymentSchema = z.object({
  amount:        z.coerce.number().positive("পরিমাণ দিন"),
  method:        z.enum(["CASH","CARD","BKASH","NAGAD","ROCKET","BANK_TRANSFER","OTHER"]).default("CASH"),
  transactionId: z.string().optional(),
  note:          z.string().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["DRAFT","ISSUED","CANCELLED"]),
});

export type CreateInvoiceInput       = z.infer<typeof createInvoiceSchema>;
export type AddPaymentInput          = z.infer<typeof addPaymentSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
