import { Router } from "express";
import {
  handleCheckIn, handleCheckOut, handleGetToday, handleGetMyHistory,
  handleListAll, handleTodaySummary,
  handleGetSettings, handleUpdateSettings,
  handleDailyReport, handleWeeklyReport, handleMonthlyReport,
  handleEmployeeReport, handleDepartmentReport,
} from "../controllers/attendance.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();
router.use(authenticate);

const adminHR = authorize("SUPER_ADMIN", "ADMIN", "HR");

// Self-service
router.post("/check-in",   handleCheckIn);
router.post("/check-out",  handleCheckOut);
router.get( "/today",      handleGetToday);
router.get( "/my-history", handleGetMyHistory);

// Admin/HR — list & summary
router.get("/",        adminHR, handleListAll);
router.get("/summary", adminHR, handleTodaySummary);

// Settings
router.get(  "/settings", adminHR, handleGetSettings);
router.patch("/settings", adminHR, handleUpdateSettings);

// Reports
router.get("/reports/daily",      adminHR, handleDailyReport);
router.get("/reports/weekly",     adminHR, handleWeeklyReport);
router.get("/reports/monthly",    adminHR, handleMonthlyReport);
router.get("/reports/employee",   adminHR, handleEmployeeReport);
router.get("/reports/department", adminHR, handleDepartmentReport);

export default router;
