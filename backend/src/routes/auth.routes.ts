import { Router } from "express";
import { login, logout, me, register, changePassword, listUsers, toggleUserStatus, updateUserRole } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema, changePasswordSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

// Protected — only admins can register new staff
router.post("/register", authenticate, validate(registerSchema), register);

// Change own password
router.post("/change-password", authenticate, validate(changePasswordSchema), changePassword);

// User management (admin only)
router.get("/users", authenticate, authorize("SUPER_ADMIN", "ADMIN"), listUsers);
router.patch("/users/:id/toggle", authenticate, authorize("SUPER_ADMIN", "ADMIN"), toggleUserStatus);
router.patch("/users/:id/role", authenticate, authorize("SUPER_ADMIN"), updateUserRole);

export default router;
