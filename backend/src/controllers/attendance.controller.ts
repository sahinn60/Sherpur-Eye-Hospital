import { Request, Response, NextFunction } from "express";
import {
  checkIn, checkOut, getTodayAttendance,
  getMyHistory, listAttendances, getTodaySummary,
} from "../services/attendance.service";
import { getSettings, updateSettings } from "../services/attendance.settings.service";
import {
  getDailyReport, getWeeklyReport, getMonthlyReport,
  getEmployeeReport, getDepartmentReport,
} from "../services/attendance.report.service";
import { successResponse } from "../utils/response";

// ─── Self ─────────────────────────────────────────────────────────────────────

export async function handleCheckIn(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("চেক-ইন সফল হয়েছে", await checkIn(req.user!.userId, req.body)));
  } catch (err) { next(err); }
}

export async function handleCheckOut(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("চেক-আউট সফল হয়েছে", await checkOut(req.user!.userId, req.body)));
  } catch (err) { next(err); }
}

export async function handleGetToday(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Today's attendance", await getTodayAttendance(req.user!.userId)));
  } catch (err) { next(err); }
}

export async function handleGetMyHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query as Record<string, string>;
    res.json(successResponse("History", await getMyHistory(
      req.user!.userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 30,
    )));
  } catch (err) { next(err); }
}

// ─── Admin: List ──────────────────────────────────────────────────────────────

export async function handleListAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, departmentId, date, dateFrom, dateTo, status, page, limit } = req.query as Record<string, string>;
    res.json(successResponse("Attendances fetched", await listAttendances({
      userId, departmentId, date, dateFrom, dateTo, status,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 30,
    })));
  } catch (err) { next(err); }
}

export async function handleTodaySummary(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Today summary", await getTodaySummary()));
  } catch (err) { next(err); }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function handleGetSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Settings", await getSettings()));
  } catch (err) { next(err); }
}

export async function handleUpdateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Settings updated", await updateSettings(req.body)));
  } catch (err) { next(err); }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function handleDailyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { date, departmentId, status } = req.query as Record<string, string>;
    const d = date || new Date().toISOString().split("T")[0];
    res.json(successResponse("Daily report", await getDailyReport({ date: d, departmentId, status })));
  } catch (err) { next(err); }
}

export async function handleWeeklyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo, departmentId } = req.query as Record<string, string>;
    res.json(successResponse("Weekly report", await getWeeklyReport({ dateFrom, dateTo, departmentId })));
  } catch (err) { next(err); }
}

export async function handleMonthlyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month, departmentId } = req.query as Record<string, string>;
    const y = year  ? parseInt(year)  : new Date().getFullYear();
    const m = month ? parseInt(month) : new Date().getMonth() + 1;
    res.json(successResponse("Monthly report", await getMonthlyReport({ year: y, month: m, departmentId })));
  } catch (err) { next(err); }
}

export async function handleEmployeeReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo, userId, departmentId } = req.query as Record<string, string>;
    res.json(successResponse("Employee report", await getEmployeeReport({ dateFrom, dateTo, userId, departmentId })));
  } catch (err) { next(err); }
}

export async function handleDepartmentReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo } = req.query as Record<string, string>;
    res.json(successResponse("Department report", await getDepartmentReport({ dateFrom, dateTo })));
  } catch (err) { next(err); }
}
