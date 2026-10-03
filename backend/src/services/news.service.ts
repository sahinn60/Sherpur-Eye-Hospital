import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { NewsCategory } from "@prisma/client";
import { CreateNewsArticleInput, UpdateNewsArticleInput } from "../validators/news.validator";

const PUBLIC_SELECT = {
  id: true,
  slug: true,
  titleBn: true,
  titleEn: true,
  shortDescBn: true,
  shortDescEn: true,
  contentBn: true,
  contentEn: true,
  featuredImage: true,
  category: true,
  authorBn: true,
  authorEn: true,
  isFeatured: true,
  publishedAt: true,
  createdAt: true,
};

export async function getAllNewsArticles(category?: string) {
  return prisma.newsArticle.findMany({
    where: {
      isPublished: true,
      ...(category && category !== "ALL" ? { category: category as NewsCategory } : {}),
    },
    select: PUBLIC_SELECT,
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getNewsArticleBySlug(slug: string) {
  const article = await prisma.newsArticle.findFirst({
    where: { slug, isPublished: true },
    select: PUBLIC_SELECT,
  });
  if (!article) throw new AppError("Article not found", 404);
  return article;
}

export async function getNewsArticleById(id: string) {
  const article = await prisma.newsArticle.findUnique({ where: { id } });
  if (!article) throw new AppError("Article not found", 404);
  return article;
}

export async function createNewsArticle(input: CreateNewsArticleInput) {
  const existing = await prisma.newsArticle.findUnique({ where: { slug: input.slug } });
  if (existing) throw new AppError("Slug already exists", 409);
  return prisma.newsArticle.create({
    data: {
      ...input,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
    },
    select: PUBLIC_SELECT,
  });
}

export async function updateNewsArticle(id: string, input: UpdateNewsArticleInput) {
  const existing = await prisma.newsArticle.findUnique({ where: { id } });
  if (!existing) throw new AppError("Article not found", 404);
  if (input.slug && input.slug !== existing.slug) {
    const slugTaken = await prisma.newsArticle.findUnique({ where: { slug: input.slug } });
    if (slugTaken) throw new AppError("Slug already exists", 409);
  }
  return prisma.newsArticle.update({
    where: { id },
    data: {
      ...input,
      ...(input.publishedAt ? { publishedAt: new Date(input.publishedAt) } : {}),
    },
    select: PUBLIC_SELECT,
  });
}

export async function deleteNewsArticle(id: string) {
  const existing = await prisma.newsArticle.findUnique({ where: { id } });
  if (!existing) throw new AppError("Article not found", 404);
  await prisma.newsArticle.update({ where: { id }, data: { isPublished: false } });
}
