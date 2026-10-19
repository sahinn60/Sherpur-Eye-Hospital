import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as Q from "../services/queue.service";

// ── PUBLIC ────────────────────────────────────────────────────────────────────

export async function publicDoctors(_req: Request, res: Response, next: NextFunction) {
  try { res.json(successResponse("Doctors", await Q.publicDoctorList())); }
  catch (e) { next(e); }
}

export async function publicSessions(req: Request, res: Response, next: NextFunction) {
  try { res.json(successResponse("Sessions", await Q.publicSessionsForDoctor(req.params.doctorId))); }
  catch (e) { next(e); }
}

export async function publicSerial(req: Request, res: Response, next: NextFunction) {
  try { res.json(successResponse("Serial", await Q.publicSerialData(req.params.sessionId))); }
  catch (e) { next(e); }
}

// ── STAFF ─────────────────────────────────────────────────────────────────────

export async function listSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const { date } = req.query as { date?: string };
    const role = req.user!.role;
    if (role === "DOCTOR") {
      const doctor = await import("../config/database").then(m =>
        m.prisma.doctor.findUnique({ where: { userId: req.user!.userId } })
      );
      if (!doctor) { res.json(successResponse("Sessions", [])); return; }
      res.json(successResponse("Sessions", await Q.listSessionsForDoctor(doctor.id, date)));
    } else {
      res.json(successResponse("Sessions", await Q.listAllSessions(date)));
    }
  } catch (e) { next(e); }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("Session created", await Q.createSession({ ...req.body, createdBy: req.user!.userId })));
  } catch (e) { next(e); }
}

export async function sessionAction(req: Request, res: Response, next: NextFunction) {
  try {
    const { action } = req.params as { action: string };
    res.json(successResponse("Done", await Q.updateSessionStatus(req.params.id, action as any, req.user!.userId, req.user!.role)));
  } catch (e) { next(e); }
}

export async function togglePublic(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Updated", await Q.toggleSessionPublic(req.params.id, req.body.isPublic)));
  } catch (e) { next(e); }
}

export async function getEntries(req: Request, res: Response, next: NextFunction) {
  try { res.json(successResponse("Entries", await Q.getSessionEntries(req.params.sessionId))); }
  catch (e) { next(e); }
}

export async function addEntry(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("Entry added", await Q.addEntry({ ...req.body, addedBy: req.user!.userId })));
  } catch (e) { next(e); }
}

export async function callNext(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Called", await Q.callNext(req.params.sessionId, req.user!.userId, req.user!.role)));
  } catch (e) { next(e); }
}

export async function completeEntry(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Completed", await Q.completeEntry(req.params.entryId, req.user!.userId, req.user!.role)));
  } catch (e) { next(e); }
}

export async function skipEntry(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Skipped", await Q.skipEntry(req.params.entryId, req.body.reason || "", req.user!.userId, req.user!.role)));
  } catch (e) { next(e); }
}

export async function restoreEntry(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Restored", await Q.restoreEntry(req.params.entryId)));
  } catch (e) { next(e); }
}
