"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

export function IntroSection() {
  const { t } = useLang();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 sm:p-10 flex items-center justify-center min-h-56 sm:min-h-72">
              <div className="text-center">
                <div className="text-6xl sm:text-8xl mb-3 sm:mb-4">🏥</div>
                <p className="text-primary-700 font-semibold text-base sm:text-lg">
                  {t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Adhunik Eye Hospital")}
                </p>
                <p className="text-primary-500 text-sm mt-1">
                  {t("ও ফ্যাকো সেন্টার", "& Phaco Center")}
                </p>
              </div>
            </div>
            {/* Accent card — desktop only */}
            <div className="absolute -bottom-5 -right-5 bg-primary-600 text-white rounded-xl p-4 shadow-xl hidden md:block">
              <p className="text-2xl font-bold">{t("আধুনিক", "Modern")}</p>
              <p className="text-primary-200 text-xs">{t("চক্ষু সেবা", "Eye Care")}</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-2 lg:mt-0">
            <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
              {t("আমাদের সম্পর্কে", "About Us")}
            </span>
            <h2
              className="font-bold text-gray-900 mt-2 mb-4 leading-tight"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}
            >
              {t("শেরপুরের বিশ্বস্ত চক্ষু সেবা কেন্দ্র", "Sherpur's Trusted Eye Care Center")}
            </h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                {t(
                  "শেরপুর আধুনিক চক্ষু হাসপাতাল ও ফ্যাকো সেন্টার শেরপুর জেলার মানুষের চোখের সেবায় নিবেদিত একটি বিশেষায়িত চিকিৎসা প্রতিষ্ঠান। আমরা সর্বাধুনিক প্রযুক্তি ও অভিজ্ঞ চিকিৎসক দলের মাধ্যমে রোগীদের সর্বোত্তম চক্ষু সেবা প্রদান করে আসছি।",
                  "Sherpur Adhunik Eye Hospital & Phaco Center is a specialized medical institution dedicated to eye care for the people of Sherpur district. We provide the best eye care services through modern technology and an experienced medical team."
                )}
              </p>
              <p>
                {t(
                  "আমাদের হাসপাতালে ফ্যাকো ক্যাটারেক্ট সার্জারি, রেটিনা চিকিৎসা, গ্লুকোমা ব্যবস্থাপনা সহ চোখের সকল ধরনের চিকিৎসা সেবা পাওয়া যায়।",
                  "Our hospital offers all types of eye care including phaco cataract surgery, retina treatment, and glaucoma management."
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 mb-6 sm:mb-8">
              {[
                { bn: "অভিজ্ঞ চিকিৎসক", en: "Experienced Doctors" },
                { bn: "আধুনিক প্রযুক্তি", en: "Modern Technology" },
                { bn: "সাশ্রয়ী মূল্য", en: "Affordable Price" },
                { bn: "রোগীবান্ধব পরিবেশ", en: "Patient-friendly Environment" },
              ].map((item) => (
                <div key={item.en} className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  </div>
                  {t(item.bn, item.en)}
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-800 transition-colors text-sm sm:text-base"
            >
              {t("আরও জানুন", "Learn More")}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
