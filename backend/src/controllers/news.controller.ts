import { Request, Response, NextFunction } from "express";
import {
  getAllNewsArticles,
  getNewsArticleBySlug,
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from "../services/news.service";
import { successResponse } from "../utils/response";

export async function listNewsArticles(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const articles = await getAllNewsArticles(category);
    res.json(successResponse("News articles fetched", articles));
  } catch (err) {
    next(err);
  }
}

export async function getNewsBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await getNewsArticleBySlug(req.params.slug);
    res.json(successResponse("Article fetched", article));
  } catch (err) {
    next(err);
  }
}

export async function addNewsArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await createNewsArticle(req.body);
    res.status(201).json(successResponse("Article created", article));
  } catch (err) {
    next(err);
  }
}

export async function editNewsArticle(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await updateNewsArticle(req.params.id, req.body);
    res.json(successResponse("Article updated", article));
  } catch (err) {
    next(err);
  }
}

export async function removeNewsArticle(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteNewsArticle(req.params.id);
    res.json(successResponse("Article removed"));
  } catch (err) {
    next(err);
  }
}
