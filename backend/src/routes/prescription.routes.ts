import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { signatureUpload } from "../middleware/upload";
import * as ctrl from "../controllers/prescription.controller";

const router = Router();
const doctorAccess = [authenticate, authorize("DOCTOR", "SUPER_ADMIN", "ADMIN")];
const doctorOnly   = [authenticate, authorize("DOCTOR")];

// Settings
router.get ("/settings",            doctorOnly,   ctrl.getMySettings);
router.post("/settings",            doctorOnly,   ctrl.saveMySettings);
router.post("/settings/signature",  doctorOnly,   signatureUpload.single("signature"), ctrl.uploadSignature);
router.delete("/settings/signature",doctorOnly,   ctrl.removeSignature);

// Prescriptions
router.get ("/",           doctorAccess, ctrl.listRx);
router.post("/",           doctorOnly,   ctrl.createRx);
router.get ("/:rxId",      doctorAccess, ctrl.getRx);
router.put ("/:rxId",      doctorOnly,   ctrl.updateRx);
router.post("/:rxId/finalize", doctorOnly, ctrl.finalizeRx);
router.post("/:rxId/amend",    doctorOnly, ctrl.amendRx);
router.delete("/:rxId",    doctorOnly,   ctrl.deleteRx);

export default router;
