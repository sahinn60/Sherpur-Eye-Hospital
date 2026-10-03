import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/clinic.service";
import { createVisitSchema, createPrescriptionSchema } from "../validators/patient.validator";

async function resolveDoctor(req: Request) {
  return svc.getDoctorByUserId(req.user!.userId);
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    res.json(successResponse("Doctor profile", doctor));
  } catch (e) { next(e); }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    res.json(successResponse("Stats", await svc.getDoctorStats(doctor.id)));
  } catch (e) { next(e); }
}

export async function getTodayQueue(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    res.json(successResponse("Today queue", await svc.getTodayQueue(doctor.id)));
  } catch (e) { next(e); }
}

export async function getAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const { status, dateFrom, dateTo, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Appointments", await svc.getDoctorAppointments(doctor.id, {
      status, dateFrom, dateTo, page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function getPatients(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const { search, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Patients", await svc.getDoctorPatients(doctor.id, {
      search, page: parseInt(page), limit: parseInt(limit),
    })));
  } catch (e) { next(e); }
}

export async function createVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const parsed = createVisitSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    res.status(201).json(successResponse("ভিজিট তৈরি হয়েছে।",
      await svc.createDoctorVisit(req.params.patientId, doctor.id, parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function createPrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const parsed = createPrescriptionSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed" }); return; }
    res.status(201).json(successResponse("প্রেসক্রিপশন তৈরি হয়েছে।",
      await svc.createDoctorPrescription(req.params.patientId, doctor.id, parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function getPrescription(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    res.json(successResponse("Prescription",
      await svc.getDoctorPrescription(req.params.rxId, doctor.id)));
  } catch (e) { next(e); }
}

export async function getPrescriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await resolveDoctor(req);
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Prescriptions",
      await svc.getDoctorPrescriptions(doctor.id, parseInt(page), parseInt(limit))));
  } catch (e) { next(e); }
}
