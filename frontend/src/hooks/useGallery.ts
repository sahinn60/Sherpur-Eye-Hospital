"use client";

import { useEffect, useState } from "react";
import { GalleryImage, GalleryCategory } from "@/types/gallery";
import { fetchGalleryImages } from "@/lib/services/galleryService";

interface State {
  data: GalleryImage[] | null;
  loading: boolean;
  error: string | null;
}

export function useGallery(category?: GalleryCategory | "ALL") {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    setState({ data: null, loading: true, error: null });
    fetchGalleryImages(category)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.message || "Failed to load gallery";
        setState({ data: null, loading: false, error: msg });
      });
  }, [category]);

  return state;
}
