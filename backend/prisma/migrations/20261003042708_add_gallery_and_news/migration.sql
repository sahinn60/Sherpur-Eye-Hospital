-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('HOSPITAL', 'DOCTORS', 'FACILITIES', 'EVENTS', 'OTHER');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('ANNOUNCEMENT', 'HEALTH_TIPS', 'EVENTS', 'ACHIEVEMENTS', 'OTHER');

-- CreateTable
CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "category" "GalleryCategory" NOT NULL DEFAULT 'OTHER',
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleBn" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescBn" TEXT NOT NULL,
    "shortDescEn" TEXT NOT NULL,
    "contentBn" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "featuredImage" TEXT,
    "imagePublicId" TEXT,
    "category" "NewsCategory" NOT NULL DEFAULT 'OTHER',
    "authorBn" TEXT NOT NULL DEFAULT 'হাসপাতাল কর্তৃপক্ষ',
    "authorEn" TEXT NOT NULL DEFAULT 'Hospital Authority',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");
