"use client";

import { useEffect, useState } from "react";
import { NewsArticle, NewsCategory } from "@/types/news";
import { fetchNewsArticles, fetchNewsArticleBySlug } from "@/lib/services/newsService";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useNews(category?: NewsCategory | "ALL") {
  const [state, setState] = useState<State<NewsArticle[]>>({ data: null, loading: true, error: null });

  useEffect(() => {
    setState({ data: null, loading: true, error: null });
    fetchNewsArticles(category)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to load news";
        setState({ data: null, loading: false, error: msg });
      });
  }, [category]);

  return state;
}

export function useNewsArticle(slug: string) {
  const [state, setState] = useState<State<NewsArticle>>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!slug) return;
    setState({ data: null, loading: true, error: null });
    fetchNewsArticleBySlug(slug)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Article not found";
        setState({ data: null, loading: false, error: msg });
      });
  }, [slug]);

  return state;
}
