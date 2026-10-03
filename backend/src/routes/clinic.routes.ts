import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/clinic.controller";

const router = Router();
const doctorOnly = [authenticate, authorize("DOCTOR")];
// Admins can also access clinic endpoints (for oversight)
const clinicAccess = [authenticate, authorize("DOCTOR", "SUPER_ADMIN", "ADMIN")];

router.get("/me",           clinicAccess, ctrl.getMe);
router.get("/stats",        clinicAccess, ctrl.getStats);
router.get("/today",        clinicAccess, ctrl.getTodayQueue);
router.get("/appointments", clinicAccess, ctrl.getAppointments);
router.get("/patients",     clinicAccess, ctrl.getPatients);
router.get("/prescriptions",             clinicAccess, ctrl.getPrescriptions);
router.get("/prescriptions/:rxId",       clinicAccess, ctrl.getPrescription);

router.post("/patients/:patientId/visits",        doctorOnly, ctrl.createVisit);
router.post("/patients/:patientId/prescriptions", doctorOnly, ctrl.createPrescription);

export default router;
