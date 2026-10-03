"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { CONTACT_REASONS } from "@/lib/config/aboutConfig";
import { HOSPITAL_INFO } from "@/lib/config/siteConfig";
import { SectionHeader } from "@/components/ui/shared";

export function ContactReasonsSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          tag={t("কখন আসবেন", "When to Visit")}
          title={t("কোন সমস্যায় আমাদের সাথে যোগাযোগ করবেন", "When to Contact Us")}
          subtitle={t(
            "চোখের যেকোনো সমস্যায় দেরি না করে বিশেষজ্ঞ পরামর্শ নিন।",
            "Don't delay — seek specialist advice for any eye problem."
          )}
          align="center"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CONTACT_REASONS.map((reason) => (
            <div
              key={reason.titleEn}
              className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all"
            >
              <div className="text-3xl flex-shrink-0">{reason.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1.5">
                  {t(reason.titleBn, reason.titleEn)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t(reason.descBn, reason.descEn)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency strip */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              🚨
            </div>
            <div>
              <p className="font-bold text-red-800">
                {t("জরুরি চক্ষু সেবা", "Emergency Eye Care")}
              </p>
              <p className="text-red-600 text-sm">
                {t(
                  "চোখের জরুরি সমস্যায় এখনই কল করুন",
                  "Call now for any eye emergency"
                )}
              </p>
            </div>
          </div>
          <a
            href={`tel:${HOSPITAL_INFO.emergency}`}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors flex-shrink-0"
          >
            <Phone size={16} />
            {HOSPITAL_INFO.emergency}
          </a>
        </div>
      </div>
    </section>
  );
}
