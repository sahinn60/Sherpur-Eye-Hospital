import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import { queryAuditLogs, getAuditStats } from "../services/audit.service";

export async function listLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      userId, module, action, search,
      dateFrom, dateTo,
      page = "1", limit = "50",
    } = req.query as Record<string, string>;

    const data = await queryAuditLogs({
      userId, module, action, search, dateFrom, dateTo,
      page:  parseInt(page),
      limit: Math.min(parseInt(limit), 100),
    });
    res.json(successResponse("Audit logs", data));
  } catch (e) { next(e); }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Audit stats", await getAuditStats()));
  } catch (e) { next(e); }
}
