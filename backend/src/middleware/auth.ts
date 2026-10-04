import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/response";
import { UserRole } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: UserRole };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.token as string | undefined;
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = cookieToken || headerToken;

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired session. Please log in again.", 401));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
}

// Shorthand guards
export const requireAdmin = authorize("SUPER_ADMIN", "ADMIN");
export const requireSuperAdmin = authorize("SUPER_ADMIN");
