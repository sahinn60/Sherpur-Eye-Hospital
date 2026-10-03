import api from "@/lib/api";
import { GalleryImage, GalleryCategory } from "@/types/gallery";

export async function fetchGalleryImages(category?: GalleryCategory | "ALL"): Promise<GalleryImage[]> {
  const params = category && category !== "ALL" ? { category } : {};
  const res = await api.get("/gallery", { params });
  return res.data.data;
}

export async function createGalleryImage(data: Partial<GalleryImage>): Promise<GalleryImage> {
  return (await api.post("/gallery", data)).data.data;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await api.delete(`/gallery/${id}`);
}
