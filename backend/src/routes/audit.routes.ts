import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth";
import { listLogs, getStats } from "../controllers/audit.controller";

const router = Router();
router.use(authenticate, requireAdmin);

router.get("/",      listLogs);
router.get("/stats", getStats);

export default router;
