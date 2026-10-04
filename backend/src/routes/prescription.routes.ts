import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { signatureUpload, uploadToCloudinary } from "../middleware/upload";
import * as ctrl from "../controllers/prescription.controller";
import * as tmpl from "../controllers/template.controller";
import * as admin from "../controllers/admin.prescription.controller";

const router = Router();
const doctorAccess = [authenticate, authorize("DOCTOR", "SUPER_ADMIN", "ADMIN", "RECEPTION")];
const doctorOnly   = [authenticate, authorize("DOCTOR")];
const adminOnly    = [authenticate, authorize("SUPER_ADMIN", "ADMIN")];

// ── Admin: Hospital Rx Settings ───────────────────────────────────────────────
router.get   ("/admin/hospital-settings",       [authenticate], admin.getHospitalRxSettings);
router.post  ("/admin/hospital-settings",       adminOnly, admin.saveHospitalRxSettings);
router.post  ("/admin/hospital-settings/logo",  adminOnly, signatureUpload.single("logo"), uploadToCloudinary("rx_logos"), admin.uploadHospitalLogo);

// ── Admin: Doctor Rx Settings ─────────────────────────────────────────────────
router.get   ("/admin/doctors",                                    adminOnly, admin.listDoctorsWithSettings);
router.get   ("/admin/doctors/:doctorId/settings",                 [authenticate, authorize("SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION")], admin.getDoctorRxSettings);
router.put   ("/admin/doctors/:doctorId/settings",                 adminOnly, admin.saveDoctorRxSettings);
router.post  ("/admin/doctors/:doctorId/settings/signature",       adminOnly, signatureUpload.single("signature"), uploadToCloudinary("signatures"), admin.uploadDoctorSignature);
router.delete("/admin/doctors/:doctorId/settings/signature",       adminOnly, admin.removeDoctorSignature);
// Settings
router.get ("/settings",            doctorAccess, ctrl.getMySettings);
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
