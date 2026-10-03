export type GalleryCategory = "HOSPITAL" | "DOCTORS" | "FACILITIES" | "EVENTS" | "OTHER";

export interface GalleryImage {
  id: string;
  titleBn: string;
  titleEn: string;
  category: GalleryCategory;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  sortOrder: number;
  createdAt: string;
}

export interface GalleryCategoryTab {
  value: GalleryCategory | "ALL";
  labelBn: string;
  labelEn: string;
}

export const GALLERY_CATEGORY_TABS: GalleryCategoryTab[] = [
  { value: "ALL", labelBn: "সকল", labelEn: "All" },
  { value: "HOSPITAL", labelBn: "হাসপাতাল", labelEn: "Hospital" },
  { value: "DOCTORS", labelBn: "চিকিৎসক", labelEn: "Doctors" },
  { value: "FACILITIES", labelBn: "সুবিধাসমূহ", labelEn: "Facilities" },
  { value: "EVENTS", labelBn: "ইভেন্ট", labelEn: "Events" },
  { value: "OTHER", labelBn: "অন্যান্য", labelEn: "Other" },
];
