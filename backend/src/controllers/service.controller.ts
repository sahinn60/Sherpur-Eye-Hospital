import { Request, Response, NextFunction } from "express";
import {
  getAllServices, getServiceById,
  createService, updateService, deleteService,
} from "../services/service.service";
import { successResponse } from "../utils/response";

export async function listServices(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Services fetched", await getAllServices()));
  } catch (err) { next(err); }
}

export async function getService(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Service fetched", await getServiceById(req.params.id)));
  } catch (err) { next(err); }
}

export async function addService(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(successResponse("Service created", await createService(req.body)));
  } catch (err) { next(err); }
}

export async function editService(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(successResponse("Service updated", await updateService(req.params.id, req.body)));
  } catch (err) { next(err); }
}

export async function removeService(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteService(req.params.id);
    res.json(successResponse("Service removed"));
  } catch (err) { next(err); }
}
