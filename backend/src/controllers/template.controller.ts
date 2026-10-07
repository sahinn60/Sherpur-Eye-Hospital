import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/template.service";
import { getDoctorByUserId } from "../services/clinic.service";

async function resolveDoctor(req: Request) {
  return getDoctorByUserId(req.user!.userId);
}

function isAdmin(req: Request) {
  return ["SUPER_ADMIN", "ADMIN", "RECEPTION"].includes(req.user!.role);
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, category, page = "1", limit = "20" } = req.query as Record<string, string>;
    let doctorId: string | undefined;
    if (!isAdmin(req)) {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    const data = await svc.listTemplates({
      doctorId, search, category,
      page: parseInt(page), limit: parseInt(limit),
    });
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    let doctorId: string | undefined;
    if (!isAdmin(req)) {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    const data = await svc.getTemplate(req.params.id, doctorId);
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    let doctorId: string | null = null;
    if (!isAdmin(req)) {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    const data = await svc.createTemplate(doctorId, req.user!.userId, req.body);
    res.status(201).json(successResponse("টেমপ্লেট তৈরি হয়েছে।", data));
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    let doctorId: string;
    if (isAdmin(req)) {
      const t = await svc.getTemplate(req.params.id);
      doctorId = t.doctorId || req.user!.userId;
    } else {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    const data = await svc.updateTemplate(req.params.id, doctorId, req.body);
    res.json(successResponse("আপডেট হয়েছে।", data));
  } catch (e) { next(e); }
}

export async function duplicate(req: Request, res: Response, next: NextFunction) {
  try {
    let doctorId: string;
    if (isAdmin(req)) {
      doctorId = req.user!.userId;
    } else {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    const data = await svc.duplicateTemplate(req.params.id, doctorId, req.user!.userId);
    res.status(201).json(successResponse("টেমপ্লেট কপি হয়েছে।", data));
  } catch (e) { next(e); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    let doctorId = "";
    if (!isAdmin(req)) {
      const doc = await resolveDoctor(req);
      doctorId = doc.id;
    }
    await svc.deleteTemplate(req.params.id, doctorId, isAdmin(req));
    res.json(successResponse("মুছে গেছে।"));
  } catch (e) { next(e); }
}
