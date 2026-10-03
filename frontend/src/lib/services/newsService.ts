import api from "@/lib/api";
import { NewsArticle, NewsCategory } from "@/types/news";

export async function fetchNewsArticles(category?: NewsCategory | "ALL"): Promise<NewsArticle[]> {
  const params = category && category !== "ALL" ? { category } : {};
  const res = await api.get("/news", { params });
  return res.data.data;
}

export async function fetchNewsArticleBySlug(slug: string): Promise<NewsArticle> {
  const res = await api.get(`/news/${slug}`);
  return res.data.data;
}

export async function createNewsArticle(data: Partial<NewsArticle>): Promise<NewsArticle> {
  return (await api.post("/news", data)).data.data;
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
  return (await api.patch(`/news/${id}`, data)).data.data;
}

export async function deleteNewsArticle(id: string): Promise<void> {
  await api.delete(`/news/${id}`);
}
