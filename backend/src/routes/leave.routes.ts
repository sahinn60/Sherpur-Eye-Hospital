import { Router } from "express";
import {
  handleApply, handleMyLeaves, handleListAll,
  handleReview, handleCancel, handleSummary,
} from "../controllers/leave.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { applyLeaveSchema, reviewLeaveSchema } from "../validators/leave.validator";

const router = Router();
router.use(authenticate);

const adminHR = authorize("SUPER_ADMIN", "ADMIN", "HR");

// Self
router.post("/",              validate(applyLeaveSchema), handleApply);
router.get( "/my",            handleMyLeaves);
router.get( "/summary",       handleSummary);
router.patch("/:id/cancel",   handleCancel);

// Admin/HR
router.get(  "/admin",        adminHR, handleListAll);
router.patch("/:id/review",   adminHR, validate(reviewLeaveSchema), handleReview);

export default router;
