"use client";

import { useState } from "react";
import { useLang } from "@/context/LangContext";
import { useServices } from "@/hooks/useServices";
import { ServiceCard } from "./ServiceCard";
import { ServiceCardSkeleton } from "./ServiceSkeleton";
import { Service } from "@/types/service";

const CATEGORY_FILTERS: { value: Service["category"] | "ALL"; bn: string; en: string }[] = [
  { value: "ALL",         bn: "সব",          en: "All" },
  { value: "PHACO",       bn: "ফ্যাকো",       en: "Phaco" },
  { value: "CATARACT",    bn: "ছানি",         en: "Cataract" },
  { value: "RETINA",      bn: "রেটিনা",       en: "Retina" },
  { value: "GLAUCOMA",    bn: "গ্লুকোমা",     en: "Glaucoma" },
  { value: "PEDIATRIC",   bn: "শিশু চক্ষু",   en: "Pediatric" },
  { value: "DIABETIC",    bn: "ডায়াবেটিক",   en: "Diabetic" },
  { value: "EXAMINATION", bn: "পরীক্ষা",      en: "Examination" },
  { value: "GENERAL",     bn: "সাধারণ",       en: "General" },
];

export function ServiceList() {
  const { t } = useLang();
  const { data: services, loading, error } = useServices();
  const [active, setActive] = useState<Service["category"] | "ALL">("ALL");

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-20 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          {t("কিছু একটা সমস্যা হয়েছে", "Something went wrong")}
        </h3>
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🏥</div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">
          {t("কোনো সেবা পাওয়া যায়নি", "No services found")}
        </h3>
        <p className="text-gray-400 text-sm">
          {t("সেবার তথ্য শীঘ্রই যুক্ত করা হবে।", "Service information will be added soon.")}
        </p>
      </div>
    );
  }

  // Only show filter tabs that have matching services
  const availableCategories = new Set(services.map((s) => s.category));
  const visibleFilters = CATEGORY_FILTERS.filter(
    (f) => f.value === "ALL" || availableCategories.has(f.value)
  );

  const filtered =
    active === "ALL" ? services : services.filter((s) => s.category === active);

  return (
    <div className="space-y-8">
      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {visibleFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActive(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === filter.value
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            {t(filter.bn, filter.en)}
            {filter.value !== "ALL" && (
              <span className={`ml-1.5 text-xs ${active === filter.value ? "text-primary-200" : "text-gray-400"}`}>
                ({services.filter((s) => s.category === filter.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {t("এই বিভাগে কোনো সেবা নেই।", "No services in this category.")}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
