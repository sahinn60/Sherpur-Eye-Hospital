import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createGalleryImageSchema, updateGalleryImageSchema } from "../validators/gallery.validator";
import {
  listGalleryImages,
  getGalleryImage,
  addGalleryImage,
  editGalleryImage,
  removeGalleryImage,
} from "../controllers/gallery.controller";

const router = Router();

// Public
router.get("/", listGalleryImages);
router.get("/:id", getGalleryImage);

// Admin only
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createGalleryImageSchema), addGalleryImage);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateGalleryImageSchema), editGalleryImage);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), removeGalleryImage);

export default router;
