"use client";

import { Phone, Clock, MapPin, Globe } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function TopBar() {
  const { lang, toggle, t } = useLang();
  const { s } = useSiteSettings();

  return (
    <div className="bg-primary-900 text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <a href={`tel:${s.phone}`} className="flex items-center gap-1.5 hover:text-primary-200 transition-colors">
            <Phone size={12} />
            <span>{s.phone}</span>
          </a>
          {s.emergency && (
            <a href={`tel:${s.emergency}`} className="flex items-center gap-1.5 hover:text-primary-200 transition-colors">
              <Phone size={12} />
              <span>{t("জরুরি", "Emergency")}: {s.emergency}</span>
            </a>
          )}
          <span className="flex items-center gap-1.5 text-primary-200">
            <MapPin size={12} />
            <span>{t(s.address_bn, s.address_en)}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-primary-200">
            <Clock size={12} />
            <span>{t(s.hours_bn, s.hours_en)}</span>
          </span>
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 bg-primary-700 hover:bg-primary-600 px-2.5 py-1 rounded transition-colors font-medium"
          >
            <Globe size={12} />
            <span>{lang === "bn" ? "English" : "বাংলা"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
