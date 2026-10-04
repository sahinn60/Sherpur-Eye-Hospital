// ─── Prescription Template ────────────────────────────────────────────────────

export interface TemplateItem {
  id?:          string;
  medicineName: string;
  strength?:    string;
  dosageForm?:  string;
  eye?:         string;
  dose?:        string;
  frequency?:   string;
  duration?:    string;
  instructions?: string;
  sortOrder:    number;
}

export interface PrescriptionTemplate {
  id:             string;
  name:           string;
  nameBn:         string;
  category:       string;
  chiefComplaint?: string;
  history?:       string;
  diagnosis?:     string;
  advice?:        string;
  instructions?:  string;
  followUpNote?:  string;
  followUpDays?:  number | null;
  isShared:       boolean;
  doctorId?:      string;
  createdBy:      string;
  createdAt:      string;
  updatedAt:      string;
  items:          TemplateItem[];
}

export interface TemplateListResponse {
  items:      PrescriptionTemplate[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ─── Prescription Status ──────────────────────────────────────────────────────

export type RxStatus = "DRAFT" | "FINALIZED";
export type RxType   = "clinical" | "spectacle";

export const RX_STATUS_CONFIG: Record<RxStatus, { label: string; cls: string }> = {
  DRAFT:     { label: "ড্রাফট",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  FINALIZED: { label: "চূড়ান্ত", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export const TEMPLATE_CATEGORIES: { value: string; label: string }[] = [
  { value: "GENERAL",   label: "সাধারণ" },
  { value: "CATARACT",  label: "ছানি (Cataract)" },
  { value: "GLAUCOMA",  label: "গ্লুকোমা" },
  { value: "RETINA",    label: "রেটিনা" },
  { value: "CORNEA",    label: "কর্নিয়া" },
  { value: "DRY_EYE",   label: "শুষ্ক চোখ (Dry Eye)" },
  { value: "INFECTION", label: "সংক্রমণ (Infection)" },
  { value: "POST_OP",   label: "অপারেশন পরবর্তী (Post-op)" },
  { value: "OTHER",     label: "অন্যান্য" },
];
