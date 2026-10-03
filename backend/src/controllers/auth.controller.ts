import { Request, Response, NextFunction } from "express";
import {
  loginService,
  logoutService,
  registerService,
  getMeService,
  changePasswordService,
  listUsersService,
  toggleUserStatusService,
  updateUserRoleService,
} from "../services/auth.service";
import { successResponse } from "../utils/response";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await loginService(req.body, res);
    res.json(successResponse("Login successful", user));
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await registerService(req.body);
    res.status(201).json(successResponse("Registration successful", user));
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    logoutService(res);
    res.json(successResponse("Logged out successfully"));
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getMeService(req.user!.userId);
    res.json(successResponse("User fetched", user));
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    await changePasswordService(req.user!.userId, req.body);
    res.json(successResponse("Password changed successfully"));
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, role, page = "1", limit = "20" } = req.query as Record<string, string>;
    res.json(successResponse("Users", await listUsersService({ search, role, page: parseInt(page), limit: parseInt(limit) })));
  } catch (err) { next(err); }
}

export async function toggleUserStatus(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Status updated", await toggleUserStatusService(req.params.id, req.user!.userId)));
  } catch (err) { next(err); }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Role updated", await updateUserRoleService(req.params.id, req.body.role, req.user!.userId)));
  } catch (err) { next(err); }
}
