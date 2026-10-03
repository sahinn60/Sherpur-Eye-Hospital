import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import * as ctrl from "../controllers/surgery.controller";

const router = Router();
const access = [authenticate, authorize("SUPER_ADMIN", "ADMIN", "DOCTOR")];

router.get("/",    access, ctrl.list);
router.get("/:id", access, ctrl.get);
router.post("/",   access, ctrl.create);
router.patch("/:id", access, ctrl.update);
router.delete("/:id", [authenticate, authorize("SUPER_ADMIN", "ADMIN")], ctrl.remove);

export default router;
