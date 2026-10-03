import { Request, Response, NextFunction } from "express";
import {
  getAllDoctors, getDoctorById,
  listAllDoctors, getDoctorByIdAdmin,
  createDoctor, updateDoctor,
  toggleDoctorStatus, assignDoctorAccount,
  deleteDoctor,
} from "../services/doctor.service";
import { successResponse } from "../utils/response";

// Public
export async function listDoctors(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Doctors fetched", await getAllDoctors()));
  } catch (err) { next(err); }
}

export async function getDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Doctor fetched", await getDoctorById(req.params.id)));
  } catch (err) { next(err); }
}

// Admin
export async function listDoctorsAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit, search, isActive } = req.query as Record<string, string>;
    const result = await listAllDoctors({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search, isActive,
    });
    res.json(successResponse("Doctors fetched", result));
  } catch (err) { next(err); }
}

export async function getDoctorAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Doctor fetched", await getDoctorByIdAdmin(req.params.id)));
  } catch (err) { next(err); }
}

export async function addDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("Doctor created", await createDoctor(req.body)));
  } catch (err) { next(err); }
}

export async function editDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Doctor updated", await updateDoctor(req.params.id, req.body)));
  } catch (err) { next(err); }
}

export async function toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Status toggled", await toggleDoctorStatus(req.params.id)));
  } catch (err) { next(err); }
}

export async function assignAccount(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Login account assigned", await assignDoctorAccount(req.params.id, req.body)));
  } catch (err) { next(err); }
}

export async function removeDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteDoctor(req.params.id);
    res.json(successResponse("Doctor deactivated"));
  } catch (err) { next(err); }
}
