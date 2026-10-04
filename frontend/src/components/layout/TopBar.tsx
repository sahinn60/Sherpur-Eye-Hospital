"use client";

import { Phone, Clock, MapPin, Globe } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function TopBar() {
  const { lang, toggle, t } = useLang();
  const { s } = useSiteSettings();

  return (
    <div className="bg-primary-900 text-white text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        {/* Mobile: 2-row compact layout */}
        <div className="flex flex-col sm:hidden py-1.5 gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href={`tel:${s.phone}`} className="flex items-center gap-1 hover:text-primary-200 transition-colors">
                <Phone size={11} />
                <span className="text-[11px]">{s.phone}</span>
              </a>
              {s.emergency && (
                <a href={`tel:${s.emergency}`} className="flex items-center gap-1 text-red-300 hover:text-red-200 transition-colors">
                  <Phone size={11} />
                  <span className="text-[11px]">{t("জরুরি", "Emg")}: {s.emergency}</span>
                </a>
              )}
            </div>
            <button
              onClick={toggle}
              className="flex items-center gap-1 bg-primary-700 hover:bg-primary-600 px-2 py-0.5 rounded transition-colors font-medium text-[11px]"
            >
              <Globe size={10} />
              <span>{lang === "bn" ? "EN" : "বাং"}</span>
            </button>
          </div>
          <div className="flex items-center gap-3 text-primary-200">
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              <span className="text-[10px] truncate max-w-[160px]">{t(s.address_bn, s.address_en)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              <span className="text-[10px]">{t(s.hours_bn, s.hours_en)}</span>
            </span>
          </div>
        </div>

        {/* Desktop: single row */}
        <div className="hidden sm:flex items-center justify-between py-2 gap-2">
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
    </div>
  );
}
