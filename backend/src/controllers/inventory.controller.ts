import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/inventory.service";
import {
  createSupplierSchema, updateSupplierSchema,
  createItemSchema, updateItemSchema, adjustStockSchema,
} from "../validators/inventory.validator";

// ─── Suppliers ────────────────────────────────────────────────────────────────

export async function listSuppliers(req: Request, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.activeOnly === "true";
    res.json(successResponse("Suppliers", await svc.listSuppliers(activeOnly)));
  } catch (e) { next(e); }
}

export async function createSupplier(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createSupplierSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.status(201).json(successResponse("সাপ্লায়ার তৈরি হয়েছে।", await svc.createSupplier(parsed.data)));
  } catch (e) { next(e); }
}

export async function updateSupplier(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateSupplierSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.json(successResponse("আপডেট হয়েছে।", await svc.updateSupplier(req.params.id, parsed.data)));
  } catch (e) { next(e); }
}

export async function toggleSupplier(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("স্ট্যাটাস পরিবর্তন হয়েছে।", await svc.toggleSupplier(req.params.id)));
  } catch (e) { next(e); }
}

// ─── Items ────────────────────────────────────────────────────────────────────

export async function listItems(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, category, supplierId, isActive, lowStock, expiringSoon, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Items", await svc.listItems({
      search, category, supplierId, isActive, lowStock, expiringSoon,
      page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function getItem(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Item", await svc.getItem(req.params.id)));
  } catch (e) { next(e); }
}

export async function createItem(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.status(201).json(successResponse("আইটেম তৈরি হয়েছে।", await svc.createItem(parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateItemSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.json(successResponse("আপডেট হয়েছে।", await svc.updateItem(req.params.id, parsed.data)));
  } catch (e) { next(e); }
}

export async function toggleItem(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("স্ট্যাটাস পরিবর্তন হয়েছে।", await svc.toggleItem(req.params.id)));
  } catch (e) { next(e); }
}

export async function adjustStock(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = adjustStockSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.json(successResponse("স্টক আপডেট হয়েছে।", await svc.adjustStock(req.params.id, parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function getStockHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "30" } = req.query as Record<string, string>;
    res.json(successResponse("Stock history", await svc.getStockHistory(req.params.id, parseInt(page), parseInt(limit))));
  } catch (e) { next(e); }
}

export async function generateSku(req: Request, res: Response, next: NextFunction) {
  try {
    const category = (req.query.category as string) || "OTHER";
    res.json(successResponse("SKU", { sku: await svc.generateSku(category) }));
  } catch (e) { next(e); }
}

export async function getAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Alerts", await svc.getAlerts()));
  } catch (e) { next(e); }
}

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Summary", await svc.getInventorySummary()));
  } catch (e) { next(e); }
}
