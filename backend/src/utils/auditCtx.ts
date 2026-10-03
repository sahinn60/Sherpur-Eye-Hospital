import { Request } from "express";
import { AuditContext } from "../services/audit.service";

export function auditCtx(req: Request, userName?: string): AuditContext {
  return {
    userId:    req.user?.userId,
    userName:  userName || req.user?.userId || "Unknown",
    userRole:  req.user?.role || "",
    ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
               || req.socket.remoteAddress
               || "",
  };
}
