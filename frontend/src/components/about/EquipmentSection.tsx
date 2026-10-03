"use client";

import { useLang } from "@/context/LangContext";
import { EQUIPMENT } from "@/lib/config/aboutConfig";
import { SectionHeader } from "@/components/ui/shared";

export function EquipmentSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          tag={t("প্রযুক্তি ও যন্ত্রপাতি", "Technology & Equipment")}
          title={t("আধুনিক চিকিৎসা সরঞ্জাম", "Modern Medical Equipment")}
          subtitle={t(
            "আমরা রোগ নির্ণয় ও চিকিৎসায় আন্তর্জাতিক মানের যন্ত্রপাতি ব্যবহার করি।",
            "We use internationally standard equipment for diagnosis and treatment."
          )}
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EQUIPMENT.map((item) => (
            <div
              key={item.titleEn}
              className="bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-2xl p-6 transition-all group"
            >
              <div className="w-14 h-14 bg-white group-hover:bg-primary-100 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-sm transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {t(item.titleBn, item.titleEn)}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t(item.descBn, item.descEn)}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          {t(
            "* যন্ত্রপাতির তালিকা পরিবর্তনযোগ্য। সর্বশেষ তথ্যের জন্য হাসপাতালে যোগাযোগ করুন।",
            "* Equipment list is subject to change. Contact the hospital for the latest information."
          )}
        </p>
      </div>
    </section>
  );
}
