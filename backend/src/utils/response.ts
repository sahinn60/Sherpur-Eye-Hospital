import { ApiResponse } from "../types";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function successResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return { success: true, message, data };
}

export function errorResponse(
  message: string,
  errors?: Record<string, string[]>
): ApiResponse {
  return { success: false, message, errors };
}
