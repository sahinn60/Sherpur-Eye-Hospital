"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LangContext";
import { useGallery } from "@/hooks/useGallery";
import { GalleryCategory, GALLERY_CATEGORY_TABS } from "@/types/gallery";
import { GallerySkeleton } from "./GallerySkeleton";

export function GalleryGrid() {
  const { t } = useLang();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "ALL">("ALL");
  const [lightbox, setLightbox] = useState<{ url: string; title: string } | null>(null);
  const { data: images, loading, error } = useGallery(activeCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GALLERY_CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === tab.value
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-primary-400 hover:text-primary-600"
            }`}
          >
            {t(tab.labelBn, tab.labelEn)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <GallerySkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-500 text-lg">
            {t("গ্যালারি লোড করতে সমস্যা হয়েছে।", "Failed to load gallery.")}
          </p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && images && images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-gray-500 text-lg">
            {t("এই বিভাগে কোনো ছবি নেই।", "No images in this category.")}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && images && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox({ url: img.imageUrl, title: t(img.titleBn, img.titleEn) })}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Image
                src={img.imageUrl}
                alt={t(img.titleBn, img.titleEn)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <p className="text-white text-sm font-medium px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 line-clamp-2">
                  {t(img.titleBn, img.titleEn)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
              <Image
                src={lightbox.url}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {lightbox.title && (
              <p className="text-white text-center mt-3 text-sm">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
