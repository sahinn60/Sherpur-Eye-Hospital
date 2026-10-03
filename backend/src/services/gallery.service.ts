import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { GalleryCategory } from "@prisma/client";
import { CreateGalleryImageInput, UpdateGalleryImageInput } from "../validators/gallery.validator";

const PUBLIC_SELECT = {
  id: true,
  titleBn: true,
  titleEn: true,
  category: true,
  imageUrl: true,
  publicId: true,
  width: true,
  height: true,
  sortOrder: true,
  createdAt: true,
};

export async function getAllGalleryImages(category?: string) {
  return prisma.galleryImage.findMany({
    where: {
      isActive: true,
      ...(category && category !== "ALL" ? { category: category as GalleryCategory } : {}),
    },
    select: PUBLIC_SELECT,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getGalleryImageById(id: string) {
  const image = await prisma.galleryImage.findFirst({
    where: { id, isActive: true },
    select: PUBLIC_SELECT,
  });
  if (!image) throw new AppError("Gallery image not found", 404);
  return image;
}

export async function createGalleryImage(input: CreateGalleryImageInput) {
  return prisma.galleryImage.create({
    data: input,
    select: PUBLIC_SELECT,
  });
}

export async function updateGalleryImage(id: string, input: UpdateGalleryImageInput) {
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) throw new AppError("Gallery image not found", 404);
  return prisma.galleryImage.update({ where: { id }, data: input, select: PUBLIC_SELECT });
}

export async function deleteGalleryImage(id: string) {
  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) throw new AppError("Gallery image not found", 404);
  await prisma.galleryImage.update({ where: { id }, data: { isActive: false } });
}
