import { Router } from "express";
import {
  handleGetNotifications, handleMarkRead,
  handleMarkAllRead, handleUnreadCount,
} from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get(  "/",           handleGetNotifications);
router.get(  "/unread",     handleUnreadCount);
router.patch("/read-all",   handleMarkAllRead);
router.patch("/:id/read",   handleMarkRead);

export default router;
