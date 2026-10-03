import { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "../services/dashboard.service";
import { successResponse } from "../utils/response";

export async function dashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await getDashboardStats();
    res.json(successResponse("Dashboard stats fetched", stats));
  } catch (err) {
    next(err);
  }
}
