import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { dashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", authenticate, dashboardStats);

export default router;
