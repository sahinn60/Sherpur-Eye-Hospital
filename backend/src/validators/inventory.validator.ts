import { z } from "zod";

export const createSupplierSchema = z.object({
  name:        z.string().min(2),
  contactName: z.string().optional(),
  phone:       z.string().optional(),
  email:       z.string().email().optional().or(z.literal("")),
  address:     z.string().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();

export const createItemSchema = z.object({
  sku:           z.string().min(1),
  name:          z.string().min(1),
  nameBn:        z.string().min(1),
  category:      z.enum(["MEDICINE","SURGICAL","OPTICAL","DIAGNOSTIC","CONSUMABLE","EQUIPMENT","OTHER"]).default("OTHER"),
  supplierId:    z.string().optional(),
  unit:          z.string().default("pcs"),
  purchasePrice: z.number().min(0).default(0),
  sellingPrice:  z.number().min(0).default(0),
  stockQty:      z.number().int().min(0).default(0),
  minStock:      z.number().int().min(0).default(5),
  expiryDate:    z.string().optional(),
  description:   z.string().optional(),
});

export const updateItemSchema = createItemSchema.partial().omit({ sku: true });

export const adjustStockSchema = z.object({
  type:     z.enum(["PURCHASE","ADJUSTMENT","DISPENSED","EXPIRED","RETURNED","DAMAGED"]),
  quantity: z.number().int().min(1),
  unitCost: z.number().min(0).optional(),
  note:     z.string().optional(),
  refId:    z.string().optional(),
});

export type CreateSupplierInput  = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput  = z.infer<typeof updateSupplierSchema>;
export type CreateItemInput      = z.infer<typeof createItemSchema>;
export type UpdateItemInput      = z.infer<typeof updateItemSchema>;
export type AdjustStockInput     = z.infer<typeof adjustStockSchema>;
