import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/cms.controller";

const router = Router();

const ADMIN = authorize("SUPER_ADMIN", "ADMIN");

// Public (no auth) — used by frontend SSR/client
router.get("/public/settings", ctrl.getPublicSettings);
router.get("/public/sections", ctrl.getSections);
router.get("/public/notices",  ctrl.getNotices);  // ?active=true

// Admin — authenticated
router.get("/settings",          authenticate, ADMIN, ctrl.getSettings);
router.post("/settings",         authenticate, ADMIN, ctrl.saveSettings);
router.get("/sections",          authenticate, ADMIN, ctrl.getSections);
router.post("/sections",         authenticate, ADMIN, ctrl.saveSections);
router.get("/notices",           authenticate, ADMIN, ctrl.getNotices);
router.post("/notices",          authenticate, ADMIN, ctrl.addNotice);
router.patch("/notices/:id",     authenticate, ADMIN, ctrl.editNotice);
router.delete("/notices/:id",    authenticate, ADMIN, ctrl.removeNotice);

export default router;
