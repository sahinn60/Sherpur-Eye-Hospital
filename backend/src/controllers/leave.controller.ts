import { Request, Response, NextFunction } from "express";
import {
  applyLeave, getMyLeaves, listLeaves,
  reviewLeave, cancelLeave, getLeaveSummary,
} from "../services/leave.service";
import { successResponse } from "../utils/response";
import { auditCtx } from "../utils/auditCtx";

export async function handleApply(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("ছুটির আবেদন সফলভাবে জমা হয়েছে।",
      await applyLeave(req.user!.userId, req.body, auditCtx(req, req.user!.userId))));
  } catch (err) { next(err); }
}

export async function handleMyLeaves(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query as Record<string, string>;
    res.json(successResponse("My leaves", await getMyLeaves(
      req.user!.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )));
  } catch (err) { next(err); }
}

export async function handleListAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, userId, departmentId, dateFrom, dateTo, page, limit } = req.query as Record<string, string>;
    res.json(successResponse("Leaves fetched", await listLeaves({
      status, userId, departmentId, dateFrom, dateTo,
      page:  page  ? parseInt(page)  : 1,
      limit: limit ? parseInt(limit) : 20,
    })));
  } catch (err) { next(err); }
}

export async function handleReview(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("পর্যালোচনা সম্পন্ন হয়েছে।",
      await reviewLeave(req.params.id, req.user!.userId, req.body, auditCtx(req, req.user!.userId))));
  } catch (err) { next(err); }
}

export async function handleCancel(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("ছুটির আবেদন বাতিল হয়েছে।",
      await cancelLeave(req.params.id, req.user!.userId)));
  } catch (err) { next(err); }
}

export async function handleSummary(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Summary", await getLeaveSummary(req.user!.userId)));
  } catch (err) { next(err); }
}
