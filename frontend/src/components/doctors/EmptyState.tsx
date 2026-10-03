import { useLang } from "@/context/LangContext";

interface EmptyStateProps {
  icon?: string;
  titleBn?: string;
  titleEn?: string;
  descBn?: string;
  descEn?: string;
}

export function EmptyState({
  icon = "👨‍⚕️",
  titleBn = "কোনো তথ্য পাওয়া যায়নি",
  titleEn = "No data found",
  descBn = "এই মুহূর্তে কোনো তথ্য পাওয়া যাচ্ছে না।",
  descEn = "No information is available at this time.",
}: EmptyStateProps) {
  const { t } = useLang();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{t(titleBn, titleEn)}</h3>
      <p className="text-gray-400 text-sm max-w-sm">{t(descBn, descEn)}</p>
    </div>
  );
}
