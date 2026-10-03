import { Request, Response, NextFunction } from "express";
import {
  getAllGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../services/gallery.service";
import { successResponse } from "../utils/response";

export async function listGalleryImages(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const images = await getAllGalleryImages(category);
    res.json(successResponse("Gallery images fetched", images));
  } catch (err) {
    next(err);
  }
}

export async function getGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    const image = await getGalleryImageById(req.params.id);
    res.json(successResponse("Gallery image fetched", image));
  } catch (err) {
    next(err);
  }
}

export async function addGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    const image = await createGalleryImage(req.body);
    res.status(201).json(successResponse("Gallery image created", image));
  } catch (err) {
    next(err);
  }
}

export async function editGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    const image = await updateGalleryImage(req.params.id, req.body);
    res.json(successResponse("Gallery image updated", image));
  } catch (err) {
    next(err);
  }
}

export async function removeGalleryImage(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteGalleryImage(req.params.id);
    res.json(successResponse("Gallery image removed"));
  } catch (err) {
    next(err);
  }
}
