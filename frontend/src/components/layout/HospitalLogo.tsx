import Link from "next/link";
import { Eye } from "lucide-react";
import { useLang } from "@/context/LangContext";

export function HospitalLogo() {
  const { t } = useLang();

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-primary-700 transition-colors flex-shrink-0">
        <Eye size={22} className="text-white" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-primary-900 leading-tight">
          {t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Adhunik Eye Hospital")}
        </p>
        <p className="text-xs text-primary-600 font-medium">
          {t("ও ফ্যাকো সেন্টার", "& Phaco Center")}
        </p>
      </div>
    </Link>
  );
}
