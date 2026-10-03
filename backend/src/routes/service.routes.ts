import { Router } from "express";
import { listServices, getService, addService, editService, removeService } from "../controllers/service.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createServiceSchema, updateServiceSchema } from "../validators/service.validator";

const router = Router();

// Public
router.get("/", listServices);
router.get("/:id", getService);

// Admin only
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(createServiceSchema), addService);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(updateServiceSchema), editService);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), removeService);

export default router;
