import { Router } from "express";
import {
  listDoctors, getDoctor,
  listDoctorsAdmin, getDoctorAdmin,
  addDoctor, editDoctor,
  toggleStatus, assignAccount,
  removeDoctor,
} from "../controllers/doctor.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createDoctorSchema, updateDoctorSchema,
  assignDoctorAccountSchema,
} from "../validators/doctor.validator";

const router = Router();

const adminOnly = [authenticate, authorize("SUPER_ADMIN", "ADMIN")];

// Public
router.get("/",    listDoctors);
router.get("/:id", getDoctor);

// Admin — list with full data
router.get("/admin/list", ...adminOnly, listDoctorsAdmin);
router.get("/admin/:id",  ...adminOnly, getDoctorAdmin);

// CRUD
router.post(  "/",                ...adminOnly, validate(createDoctorSchema), addDoctor);
router.patch( "/:id",             ...adminOnly, validate(updateDoctorSchema), editDoctor);
router.patch( "/:id/toggle",      ...adminOnly, toggleStatus);
router.post(  "/:id/assign-account", ...adminOnly, validate(assignDoctorAccountSchema), assignAccount);
router.delete("/:id",             ...adminOnly, removeDoctor);

export default router;
