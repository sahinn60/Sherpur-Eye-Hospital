import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/billing.controller";

const router = Router();

// View: Admin, Accountant, Reception, Doctor (own patients)
const canView  = [authenticate, authorize("SUPER_ADMIN","ADMIN","ACCOUNTANT","RECEPTION","DOCTOR")];
// Write: Admin, Accountant, Reception
const canWrite = [authenticate, authorize("SUPER_ADMIN","ADMIN","ACCOUNTANT","RECEPTION")];
// Payment + status: Admin, Accountant only
const canPay   = [authenticate, authorize("SUPER_ADMIN","ADMIN","ACCOUNTANT")];

router.get("/summary",      canView,  ctrl.getDueSummary);
router.get("/",             canView,  ctrl.list);
router.post("/",            canWrite, ctrl.create);
router.get("/:id",          canView,  ctrl.getOne);
router.patch("/:id/status", canPay,   ctrl.updateStatus);
router.post("/:id/payment", canPay,   ctrl.addPayment);

export default router;
