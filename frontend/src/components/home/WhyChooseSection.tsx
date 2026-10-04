"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const REASONS = [
  { titleBn: "অভিজ্ঞ বিশেষজ্ঞ দল",   titleEn: "Experienced Specialist Team", descBn: "আমাদের চিকিৎসকরা দেশে ও বিদেশে উচ্চতর প্রশিক্ষণপ্রাপ্ত।",          descEn: "Our doctors are highly trained both locally and abroad." },
  { titleBn: "সর্বাধুনিক প্রযুক্তি",   titleEn: "Latest Technology",           descBn: "আন্তর্জাতিক মানের যন্ত্রপাতি ও সরঞ্জাম ব্যবহার করা হয়।",           descEn: "International standard equipment and instruments are used." },
  { titleBn: "রোগীকেন্দ্রিক সেবা",     titleEn: "Patient-Centered Care",       descBn: "প্রতিটি রোগীকে পরিবারের সদস্যের মতো যত্ন নেওয়া হয়।",              descEn: "Every patient is cared for like a family member." },
  { titleBn: "সাশ্রয়ী মূল্যে সেবা",   titleEn: "Affordable Services",         descBn: "উন্নত চিকিৎসা সেবা সকলের নাগালের মধ্যে রাখা আমাদের লক্ষ্য।",      descEn: "Our goal is to keep quality healthcare within everyone's reach." },
  { titleBn: "সময়মতো সেবা",           titleEn: "Timely Service",              descBn: "অ্যাপয়েন্টমেন্ট অনুযায়ী সময়মতো সেবা নিশ্চিত করা হয়।",           descEn: "Timely service is ensured as per appointment." },
  { titleBn: "সহজলভ্য অবস্থান",        titleEn: "Accessible Location",         descBn: "শেরপুর সদরে সহজে পৌঁছানো যায় এমন স্থানে অবস্থিত।",               descEn: "Located in an easily accessible area in Sherpur Sadar." },
];

export function WhyChooseSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const icons = [s.icon_why_1, s.icon_why_2, s.icon_why_3, s.icon_why_4, s.icon_why_5, s.icon_why_6];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-primary-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">{t("কেন আমরা", "Why Choose Us")}</span>
          <h2 className="font-bold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)" }}>
            {t("কেন আমাদের হাসপাতাল বেছে নেবেন?", "Why Choose Our Hospital?")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">{t("আমরা শুধু চিকিৎসা দিই না, আমরা আপনার সুস্বাস্থ্য নিশ্চিত করি।", "We don't just treat — we ensure your well-being.")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {REASONS.map((reason, i) => (
            <div key={reason.titleEn} className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all">
              <div className="text-2xl sm:text-3xl flex-shrink-0">{icons[i]}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{t(reason.titleBn, reason.titleEn)}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{t(reason.descBn, reason.descEn)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
