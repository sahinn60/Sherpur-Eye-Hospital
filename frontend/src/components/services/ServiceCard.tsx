"use client";

import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group flex flex-col">
      {/* Image / Icon area */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {service.image ? (
          <img
            src={service.image}
            alt={t(service.nameBn, service.nameEn)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
            <span className="text-6xl">{service.icon}</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {getCategoryLabel(service.category, t)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-2">
          {t(service.nameBn, service.nameEn)}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1">
          {t(service.shortDescBn, service.shortDescEn)}
        </p>

        {/* Related doctor */}
        {service.doctor && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">👨⚕️</span>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {t(service.doctor.nameBn, service.doctor.nameEn)}
              </span>
              {" — "}
              {t(service.doctor.designationBn, service.doctor.designationEn)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/services/${service.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            {t("বিস্তারিত", "Details")}
            <ArrowRight size={13} />
          </Link>
          <Link
            href={`/appointment?service=${service.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <CalendarCheck size={13} />
            {t("অ্যাপয়েন্টমেন্ট", "Appointment")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function getCategoryLabel(
  category: Service["category"],
  t: (bn: string, en: string) => string
): string {
  const map: Record<Service["category"], [string, string]> = {
    GENERAL:     ["সাধারণ", "General"],
    CATARACT:    ["ছানি", "Cataract"],
    PHACO:       ["ফ্যাকো", "Phaco"],
    GLAUCOMA:    ["গ্লুকোমা", "Glaucoma"],
    RETINA:      ["রেটিনা", "Retina"],
    CORNEA:      ["কর্নিয়া", "Cornea"],
    PEDIATRIC:   ["শিশু চক্ষু", "Pediatric"],
    DIABETIC:    ["ডায়াবেটিক", "Diabetic"],
    EXAMINATION: ["পরীক্ষা", "Examination"],
    OTHER:       ["অন্যান্য", "Other"],
  };
  const [bn, en] = map[category] ?? ["অন্যান্য", "Other"];
  return t(bn, en);
}
