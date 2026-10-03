import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/surgery.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, doctorId, dateFrom, dateTo, search, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Surgeries", await svc.listSurgeries({
      status, doctorId, dateFrom, dateTo, search,
      page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Surgery", await svc.getSurgery(req.params.id)));
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = svc.createSurgerySchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.status(201).json(successResponse("সার্জারি তৈরি হয়েছে।", await svc.createSurgery(parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = svc.updateSurgerySchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.json(successResponse("আপডেট হয়েছে।", await svc.updateSurgery(req.params.id, parsed.data)));
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.deleteSurgery(req.params.id);
    res.json(successResponse("মুছে ফেলা হয়েছে।"));
  } catch (e) { next(e); }
}
