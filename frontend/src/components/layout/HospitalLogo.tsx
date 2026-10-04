"use client";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function HospitalLogo() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden flex items-center justify-center shadow-md flex-shrink-0 bg-primary-600 group-hover:bg-primary-700 transition-colors">
        {s.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.logo_url} alt="logo" className="w-full h-full object-contain" />
        ) : (
          <>
            <Eye size={18} className="text-white sm:hidden" />
            <Eye size={22} className="text-white hidden sm:block" />
          </>
        )}
      </div>
      <div className="leading-tight min-w-0">
        {/* Mobile: shorter name */}
        <p className="text-xs font-bold text-primary-900 leading-tight sm:hidden truncate">
          {t(s.hospital_name_bn || "শেরপুর চক্ষু হাসপাতাল", s.hospital_name_en || "Sherpur Eye Hospital")}
        </p>
        {/* Desktop: full name */}
        <p className="hidden sm:block text-sm font-bold text-primary-900 leading-tight">
          {t(s.hospital_name_bn || "শেরপুর আধুনিক চক্ষু হাসপাতাল", s.hospital_name_en || "Sherpur Adhunik Eye Hospital")}
        </p>
        <p className="text-[10px] sm:text-xs text-primary-600 font-medium">
          {t(s.tagline_bn || "ও ফ্যাকো সেন্টার", s.tagline_en || "& Phaco Center")}
        </p>
      </div>
    </Link>
  );
}
