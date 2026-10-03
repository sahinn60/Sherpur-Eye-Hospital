import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as svc from "../services/finance.service";
import { createIncomeSchema, createExpenseSchema } from "../validators/finance.validator";

// ─── Income ───────────────────────────────────────────────────────────────────

export async function listIncome(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, dateFrom, dateTo, page = "1", limit = "30" } = req.query as Record<string, string>;
    res.json(successResponse("Income", await svc.listIncome({ category, dateFrom, dateTo, page: parseInt(page), limit: parseInt(limit) })));
  } catch (e) { next(e); }
}

export async function createIncome(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createIncomeSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.status(201).json(successResponse("আয় যোগ হয়েছে।", await svc.createIncome(parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function deleteIncome(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.deleteIncome(req.params.id);
    res.json(successResponse("মুছে ফেলা হয়েছে।"));
  } catch (e) { next(e); }
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export async function listExpenses(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, dateFrom, dateTo, page = "1", limit = "30" } = req.query as Record<string, string>;
    res.json(successResponse("Expenses", await svc.listExpenses({ category, dateFrom, dateTo, page: parseInt(page), limit: parseInt(limit) })));
  } catch (e) { next(e); }
}

export async function createExpense(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors }); return; }
    res.status(201).json(successResponse("ব্যয় যোগ হয়েছে।", await svc.createExpense(parsed.data, req.user!.userId)));
  } catch (e) { next(e); }
}

export async function deleteExpense(req: Request, res: Response, next: NextFunction) {
  try {
    await svc.deleteExpense(req.params.id);
    res.json(successResponse("মুছে ফেলা হয়েছে।"));
  } catch (e) { next(e); }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo } = req.query as Record<string, string>;
    res.json(successResponse("Summary", await svc.getFinanceSummary(dateFrom, dateTo)));
  } catch (e) { next(e); }
}

export async function getDailyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { dateFrom, dateTo } = req.query as Record<string, string>;
    const from = dateFrom || new Date(new Date().setDate(1)).toISOString().split("T")[0];
    const to   = dateTo   || new Date().toISOString().split("T")[0];
    res.json(successResponse("Daily report", await svc.getDailyReport(from, to)));
  } catch (e) { next(e); }
}

export async function getMonthlyReport(req: Request, res: Response, next: NextFunction) {
  try {
    const year = parseInt((req.query.year as string) || String(new Date().getFullYear()));
    res.json(successResponse("Monthly report", await svc.getMonthlyReport(year)));
  } catch (e) { next(e); }
}
