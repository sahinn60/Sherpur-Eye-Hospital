import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { upload } from "../middleware/upload";
import * as ctrl from "../controllers/cms.controller";

const router = Router();
const ADMIN = authorize("SUPER_ADMIN", "ADMIN");

// Public
router.get("/public/settings", ctrl.getPublicSettings);
router.get("/public/sections", ctrl.getSections);
router.get("/public/notices",  ctrl.getNotices);
router.post("/public/contact", ctrl.submitContact);

// Admin
router.get("/settings",          authenticate, ADMIN, ctrl.getSettings);
router.post("/settings",         authenticate, ADMIN, ctrl.saveSettings);
router.post("/upload",           authenticate, ADMIN, upload.single("file"), ctrl.uploadImage);
router.get("/sections",          authenticate, ADMIN, ctrl.getSections);
router.post("/sections",         authenticate, ADMIN, ctrl.saveSections);
router.get("/notices",           authenticate, ADMIN, ctrl.getNotices);
router.post("/notices",          authenticate, ADMIN, ctrl.addNotice);
router.patch("/notices/:id",     authenticate, ADMIN, ctrl.editNotice);
router.delete("/notices/:id",    authenticate, ADMIN, ctrl.removeNotice);

// Contact Messages
router.get("/contact-messages",        authenticate, ADMIN, ctrl.getContactMessages);
router.patch("/contact-messages/:id",  authenticate, ADMIN, ctrl.markContactRead);
router.delete("/contact-messages/:id", authenticate, ADMIN, ctrl.deleteContactMessage);

export default router;
