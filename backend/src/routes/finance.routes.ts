import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/finance.controller";

const router = Router();
const financeOnly = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "ACCOUNTANT")];

router.get("/summary",         financeOnly, ctrl.getSummary);
router.get("/report/daily",    financeOnly, ctrl.getDailyReport);
router.get("/report/monthly",  financeOnly, ctrl.getMonthlyReport);

router.get("/income",          financeOnly, ctrl.listIncome);
router.post("/income",         financeOnly, ctrl.createIncome);
router.delete("/income/:id",   financeOnly, ctrl.deleteIncome);

router.get("/expenses",        financeOnly, ctrl.listExpenses);
router.post("/expenses",       financeOnly, ctrl.createExpense);
router.delete("/expenses/:id", financeOnly, ctrl.deleteExpense);

export default router;
