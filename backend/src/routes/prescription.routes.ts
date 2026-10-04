import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { signatureUpload, uploadToCloudinary } from "../middleware/upload";
import * as ctrl from "../controllers/prescription.controller";
import * as tmpl from "../controllers/template.controller";

const router = Router();
const doctorAccess = [authenticate, authorize("DOCTOR", "SUPER_ADMIN", "ADMIN")];
const doctorOnly   = [authenticate, authorize("DOCTOR")];

// Settings
router.get ("/settings",            doctorOnly,   ctrl.getMySettings);
router.post("/settings",            doctorOnly,   ctrl.saveMySettings);
router.post("/settings/signature",  doctorOnly,   signatureUpload.single("signature"), uploadToCloudinary("signatures"), ctrl.uploadSignature);
router.delete("/settings/signature",doctorOnly,   ctrl.removeSignature);

// Templates
router.get   ("/templates",              doctorAccess, tmpl.list);
router.post  ("/templates",              doctorOnly,   tmpl.create);
router.get   ("/templates/:id",          doctorAccess, tmpl.get);
router.put   ("/templates/:id",          doctorOnly,   tmpl.update);
router.post  ("/templates/:id/duplicate",doctorOnly,   tmpl.duplicate);
router.delete("/templates/:id",          doctorOnly,   tmpl.remove);

// Prescriptions
router.get ("/",           doctorAccess, ctrl.listRx);
router.post("/",           doctorOnly,   ctrl.createRx);
router.get ("/:rxId",      doctorAccess, ctrl.getRx);
router.put ("/:rxId",      doctorOnly,   ctrl.updateRx);
router.post("/:rxId/finalize", doctorOnly, ctrl.finalizeRx);
router.post("/:rxId/amend",    doctorOnly, ctrl.amendRx);
router.delete("/:rxId",    doctorOnly,   ctrl.deleteRx);

export default router;
