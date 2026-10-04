import { Request, Response, NextFunction } from "express";
import { successResponse, AppError } from "../utils/response";
import * as svc from "../services/prescription.service";
import { getDoctorByUserId } from "../services/clinic.service";
import { auditCtx } from "../utils/auditCtx";
import path from "path";
import fs from "fs";

// ─── Resolve doctor from request ─────────────────────────────────────────────

async function resolveDoctor(req: Request) {
  return getDoctorByUserId(req.user!.userId);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getMySettings(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const settings = await svc.getDoctorSettings(doctor.id);
    res.json(successResponse("ok", settings));
  } catch (e) { next(e); }
}

export async function saveMySettings(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const data = await svc.upsertDoctorSettings(doctor.id, req.body);
    res.json(successResponse("সেটিংস সংরক্ষিত হয়েছে।", data));
  } catch (e) { next(e); }
}

export async function uploadSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    if (!req.file) { res.status(400).json({ success: false, message: "ফাইল পাওয়া যায়নি।" }); return; }
    const signatureUrl = `/uploads/signatures/${req.file.filename}`;
    const data = await svc.saveSignature(doctor.id, signatureUrl);
    res.json(successResponse("স্বাক্ষর আপলোড হয়েছে।", { signatureUrl, settings: data }));
  } catch (e) { next(e); }
}

export async function removeSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const settings = await svc.getDoctorSettings(doctor.id);
    if (settings?.signatureUrl) {
      const filePath = path.join(process.cwd(), "uploads", "signatures", path.basename(settings.signatureUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    const data = await svc.removeSignature(doctor.id);
    res.json(successResponse("স্বাক্ষর মুছে গেছে।", data));
  } catch (e) { next(e); }
}

// ─── Prescription CRUD ────────────────────────────────────────────────────────

export async function createRx(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const { patientId, ...input } = req.body;
    if (!patientId) { res.status(400).json({ success: false, message: "patientId আবশ্যক।" }); return; }
    const rx = await svc.createPrescription(doctor.id, patientId, input, req.user!.userId);
    res.status(201).json(successResponse("প্রেসক্রিপশন তৈরি হয়েছে।", rx));
  } catch (e) { next(e); }
}

export async function updateRx(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const rx = await svc.updatePrescription(req.params.rxId, doctor.id, req.body);
    res.json(successResponse("আপডেট হয়েছে।", rx));
  } catch (e) { next(e); }
}

export async function finalizeRx(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const rx = await svc.finalizePrescription(req.params.rxId, doctor.id, req.user!.userId, auditCtx(req));
    res.json(successResponse("প্রেসক্রিপশন চূড়ান্ত হয়েছে।", rx));
  } catch (e) { next(e); }
}

export async function amendRx(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const { reason, ...newData } = req.body;
    if (!reason) { res.status(400).json({ success: false, message: "সংশোধনের কারণ দিন।" }); return; }
    const rx = await svc.amendPrescription(req.params.rxId, doctor.id, reason, newData, req.user!.userId, auditCtx(req));
    res.json(successResponse("সংশোধন হয়েছে।", rx));
  } catch (e) { next(e); }
}

export async function getRx(req: Request, res: Response, next: NextFunction) {
  try {
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(req.user!.role);
    let doctorId: string | undefined;
    if (!isAdmin) {
      const doctor = await resolveDoctor(req);
      doctorId = doctor.id;
    }
    const rx = await svc.getPrescription(req.params.rxId, doctorId);
    res.json(successResponse("ok", rx));
  } catch (e) { next(e); }
}

export async function listRx(req: Request, res: Response, next: NextFunction) {
  try {
    const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(req.user!.role);
    const { patientId, status, rxType, page = "1", limit = "20" } = req.query as Record<string, string>;
    let doctorId: string | undefined;
    if (!isAdmin) {
      const doctor = await resolveDoctor(req);
      doctorId = doctor.id;
    }
    const data = await svc.listPrescriptions({
      doctorId, patientId, status, rxType,
      page: parseInt(page), limit: parseInt(limit),
    });
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function deleteRx(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    await svc.deleteDraftPrescription(req.params.rxId, doctor.id);
    res.json(successResponse("মুছে গেছে।"));
  } catch (e) { next(e); }
}
