export type ServiceCategory =
  | "GENERAL"
  | "CATARACT"
  | "PHACO"
  | "GLAUCOMA"
  | "RETINA"
  | "CORNEA"
  | "PEDIATRIC"
  | "DIABETIC"
  | "EXAMINATION"
  | "OTHER";

export interface ServicePublic {
  id: string;
  category: ServiceCategory;
  nameBn: string;
  nameEn: string;
  shortDescBn: string;
  shortDescEn: string;
  fullDescBn: string;
  fullDescEn: string;
  icon: string;
  image: string | null;
  sortOrder: number;
  doctor: {
    id: string;
    nameBn: string;
    nameEn: string;
    designationBn: string;
    designationEn: string;
    photo: string | null;
  } | null;
}
