import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createNewsArticleSchema, updateNewsArticleSchema } from "../validators/news.validator";
import {
  listNewsArticles,
  getNewsBySlug,
  addNewsArticle,
  editNewsArticle,
  removeNewsArticle,
} from "../controllers/news.controller";

const router = Router();

// Public
router.get("/", listNewsArticles);
router.get("/:slug", getNewsBySlug);

// Admin only
router.post("/", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(createNewsArticleSchema), addNewsArticle);
router.patch("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), validate(updateNewsArticleSchema), editNewsArticle);
router.delete("/:id", authenticate, authorize("ADMIN", "SUPER_ADMIN"), removeNewsArticle);

export default router;
