import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createEmployeeSchema, updateEmployeeSchema,
  assignAccountSchema, assignShiftSchema,
} from "../validators/employee.validator";
import {
  index, show, me, store, update,
  toggleStatus, setShift, setAccount,
  getDepartments, getShifts,
} from "../controllers/employee.controller";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Lookup data — any authenticated staff
router.get("/departments", getDepartments);
router.get("/shifts",      getShifts);

// Own profile — any authenticated user
router.get("/me", me);

// List + Create — Admin/HR only
router.get("/",  authorize("SUPER_ADMIN", "ADMIN", "HR"), index);
router.post("/", authorize("SUPER_ADMIN", "ADMIN", "HR"), validate(createEmployeeSchema), store);

// Single employee — Admin/HR full access; EMPLOYEE can only see own (enforced in controller)
router.get("/:id",    authorize("SUPER_ADMIN", "ADMIN", "HR", "EMPLOYEE"), show);
router.patch("/:id",  authorize("SUPER_ADMIN", "ADMIN", "HR"), validate(updateEmployeeSchema), update);

// Status toggle — Admin only
router.patch("/:id/toggle-status", authorize("SUPER_ADMIN", "ADMIN"), toggleStatus);

// Assign shift — Admin/HR
router.patch("/:id/shift",   authorize("SUPER_ADMIN", "ADMIN", "HR"), validate(assignShiftSchema), setShift);

// Assign login account — Admin only
router.post("/:id/account",  authorize("SUPER_ADMIN", "ADMIN"), validate(assignAccountSchema), setAccount);

export default router;
