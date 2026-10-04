import { TEMPLATE_CATEGORIES } from "@/types/prescription";

const COLOR_MAP: Record<string, string> = {
  CATARACT:  "bg-blue-50 text-blue-700",
  GLAUCOMA:  "bg-purple-50 text-purple-700",
  RETINA:    "bg-red-50 text-red-700",
  CORNEA:    "bg-teal-50 text-teal-700",
  DRY_EYE:   "bg-sky-50 text-sky-700",
  INFECTION: "bg-orange-50 text-orange-700",
  POST_OP:   "bg-emerald-50 text-emerald-700",
  GENERAL:   "bg-gray-100 text-gray-600",
  OTHER:     "bg-gray-100 text-gray-500",
};

export function TemplateCategoryBadge({ category }: { category: string }) {
  const label = TEMPLATE_CATEGORIES.find((c) => c.value === category)?.label ?? category;
  const cls   = COLOR_MAP[category] ?? COLOR_MAP.OTHER;
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}
