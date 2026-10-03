import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/patient.service";
import {
  createPatientSchema, updatePatientSchema,
  createVisitSchema, createPrescriptionSchema,
} from "../validators/patient.validator";
import { auditCtx } from "../utils/auditCtx";
import { writeAudit } from "../services/audit.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, gender, isActive, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Patients fetched", await svc.listPatients({
      search, gender, isActive, page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createPatientSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    res.status(201).json(successResponse("রোগী নিবন্ধিত হয়েছে।",
      await svc.createPatient(parsed.data, req.user!.userId, auditCtx(req, req.user!.userId))));
  } catch (e) { next(e); }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Patient fetched", await svc.getPatient(req.params.id)));
  } catch (e) { next(e); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updatePatientSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    const patient = await svc.updatePatient(req.params.id, parsed.data);
    writeAudit({ ctx: auditCtx(req, req.user?.userId), action: "UPDATE", module: "patient", recordId: req.params.id, recordLabel: patient.nameBn });
    res.json(successResponse("রোগীর তথ্য আপডেট হয়েছে।", patient));
  } catch (e) { next(e); }
}

export async function toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("স্ট্যাটাস পরিবর্তন হয়েছে।",
      await svc.togglePatientStatus(req.params.id)));
  } catch (e) { next(e); }
}

export async function listVisits(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Visits fetched",
      await svc.getPatientVisits(req.params.id, parseInt(page), parseInt(limit))));
  } catch (e) { next(e); }
}

export async function createVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createVisitSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    res.status(201).json(successResponse("ভিজিট যোগ হয়েছে।",
      await svc.addVisit(req.params.id, parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function listPrescriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Prescriptions fetched",
      await svc.getPatientPrescriptions(req.params.id, parseInt(page), parseInt(limit))));
  } catch (e) { next(e); }
}

export async function createPrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createPrescriptionSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    res.status(201).json(successResponse("প্রেসক্রিপশন যোগ হয়েছে।",
      await svc.addPrescription(req.params.id, parsed.data, req.user!.userId, auditCtx(req, req.user!.userId))));
  } catch (e) { next(e); }
}

export async function getOnePrescription(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Prescription fetched", await svc.getPrescription(req.params.rxId)));
  } catch (e) { next(e); }
}

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const patient = await svc.getPatient(req.params.id);
    res.json(successResponse("Appointments fetched",
      await svc.getPatientAppointments(patient.phone, parseInt(page), parseInt(limit))));
  } catch (e) { next(e); }
}
