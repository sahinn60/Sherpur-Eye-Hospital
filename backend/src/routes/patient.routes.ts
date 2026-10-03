import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/patient.controller";

const router = Router();

const canAccess = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTION")];
const canWrite  = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION")];

router.get("/",              canAccess, ctrl.list);
router.post("/",             canWrite,  ctrl.create);
router.get("/:id",           canAccess, ctrl.getOne);
router.patch("/:id",         canWrite,  ctrl.update);
router.patch("/:id/toggle",  canWrite,  ctrl.toggleStatus);

router.get("/:id/visits",    canAccess, ctrl.listVisits);
router.post("/:id/visits",   canWrite,  ctrl.createVisit);

router.get("/:id/prescriptions",          canAccess, ctrl.listPrescriptions);
router.post("/:id/prescriptions",         canWrite,  ctrl.createPrescription);
router.get("/:id/prescriptions/:rxId",    canAccess, ctrl.getOnePrescription);

router.get("/:id/appointments", canAccess, ctrl.listAppointments);

export default router;
