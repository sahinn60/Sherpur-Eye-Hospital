import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, errorResponse } from "../utils/response";
import { config } from "../config/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.errors));
    return;
  }

  // Zod validation error (from controllers using safeParse that re-throw)
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "root";
      errors[key] = [...(errors[key] || []), issue.message];
    }
    res.status(422).json(errorResponse("Validation failed", errors));
    return;
  }

  // Prisma unique constraint violation
  if ((err as any).code === "P2002") {
    res.status(409).json(errorResponse("A record with this value already exists."));
    return;
  }

  // Prisma record not found
  if ((err as any).code === "P2025") {
    res.status(404).json(errorResponse("Record not found."));
    return;
  }

  // Prisma foreign key constraint
  if ((err as any).code === "P2003") {
    res.status(400).json(errorResponse("Related record not found."));
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json(errorResponse("Invalid or expired session. Please log in again."));
    return;
  }

  // Log unexpected errors server-side only
  if (config.env !== "test") {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err.message);
    if (config.env === "development") console.error(err.stack);
  }

  // Never expose internals in production
  res.status(500).json(errorResponse(
    config.env === "production" ? "Internal server error" : err.message
  ));
}
