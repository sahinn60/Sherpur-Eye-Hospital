import { Request, Response, NextFunction } from "express";
import { getMyNotifications, markRead, getUnreadCount } from "../services/notification.service";
import { successResponse } from "../utils/response";

export async function handleGetNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query as Record<string, string>;
    res.json(successResponse("Notifications", await getMyNotifications(
      req.user!.userId,
      page  ? parseInt(page)  : 1,
      limit ? parseInt(limit) : 20,
    )));
  } catch (err) { next(err); }
}

export async function handleMarkRead(req: Request, res: Response, next: NextFunction) {
  try {
    await markRead(req.user!.userId, req.params.id || undefined);
    res.json(successResponse("Marked as read"));
  } catch (err) { next(err); }
}

export async function handleMarkAllRead(req: Request, res: Response, next: NextFunction) {
  try {
    await markRead(req.user!.userId);
    res.json(successResponse("All marked as read"));
  } catch (err) { next(err); }
}

export async function handleUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await getUnreadCount(req.user!.userId);
    res.json(successResponse("Unread count", { count }));
  } catch (err) { next(err); }
}
