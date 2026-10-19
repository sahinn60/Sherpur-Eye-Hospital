import { Router } from "express";
import {
  bookAppointment,
  listAppointments,
  getAppointment,
  trackAppointment,
  changeStatus,
  searchPatients,
} from "../controllers/appointment.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validators/appointment.validator";

const router = Router();

// Public — anyone can book or track
router.post("/", validate(createAppointmentSchema), bookAppointment);
router.get("/track/:requestId", trackAppointment);

// Staff — search appointments by name/phone for queue
router.get(
  "/search-patients",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "RECEPTION", "DOCTOR"),
  searchPatients
);

// Admin/Reception only
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "RECEPTION", "DOCTOR"),
  listAppointments
);
router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "RECEPTION", "DOCTOR"),
  getAppointment
);
router.patch(
  "/:id/status",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "RECEPTION"),
  validate(updateAppointmentStatusSchema),
  changeStatus
);

export default router;
