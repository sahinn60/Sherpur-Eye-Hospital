import { Request, Response, NextFunction } from "express";
import {
  createAppointment, getAllAppointments,
  getAppointmentById, getAppointmentByRequestId, updateAppointmentStatus,
} from "../services/appointment.service";
import { successResponse } from "../utils/response";
import { auditCtx } from "../utils/auditCtx";

export async function bookAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const ctx = req.user ? auditCtx(req, req.user.userId) : undefined;
    const appt = await createAppointment(req.body, ctx);
    res.status(201).json(successResponse("Appointment request submitted", appt));
  } catch (err) { next(err); }
}

export async function listAppointments(req: Request, res: Response, next: NextFunction) {
  try {
    const appts = await getAllAppointments(req.query.status as string | undefined);
    res.json(successResponse("Appointments fetched", appts));
  } catch (err) { next(err); }
}

export async function getAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Appointment fetched", await getAppointmentById(req.params.id)));
  } catch (err) { next(err); }
}

export async function trackAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Appointment fetched", await getAppointmentByRequestId(req.params.requestId)));
  } catch (err) { next(err); }
}

export async function changeStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const appt = await updateAppointmentStatus(
      req.params.id, req.body, req.user?.userId,
      auditCtx(req, req.user?.userId),
    );
    res.json(successResponse("Status updated", appt));
  } catch (err) { next(err); }
}
