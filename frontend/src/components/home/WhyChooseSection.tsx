"use client";

import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const REASONS = [
  { titleBn: "অভিজ্ঞ বিশেষজ্ঞ দল", titleEn: "Expert Specialist Team", descBn: "দেশে ও বিদেশে উচ্চতর প্রশিক্ষণপ্রাপ্ত চিকিৎসক।", descEn: "Doctors trained locally and abroad.", num: "০১" },
  { titleBn: "সর্বাধুনিক প্রযুক্তি", titleEn: "Latest Technology", descBn: "আন্তর্জাতিক মানের যন্ত্রপাতি ও সরঞ্জাম।", descEn: "International standard equipment.", num: "০২" },
  { titleBn: "রোগীকেন্দ্রিক সেবা", titleEn: "Patient-Centered Care", descBn: "প্রতিটি রোগীকে পরিবারের মতো যত্ন।", descEn: "Every patient cared for like family.", num: "০৩" },
  { titleBn: "সাশ্রয়ী মূল্যে সেবা", titleEn: "Affordable Services", descBn: "উন্নত চিকিৎসা সকলের নাগালে রাখা আমাদের লক্ষ্য।", descEn: "Quality healthcare within everyone's reach.", num: "০৪" },
  { titleBn: "সময়মতো সেবা", titleEn: "Timely Service", descBn: "অ্যাপয়েন্টমেন্ট অনুযায়ী সময়মতো সেবা।", descEn: "On-time service as per appointment.", num: "০৫" },
  { titleBn: "সহজলভ্য অবস্থান", titleEn: "Accessible Location", descBn: "শেরপুর সদরে সহজে পৌঁছানো যায়।", descEn: "Easily accessible in Sherpur Sadar.", num: "০৬" },
];

export function WhyChooseSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();
  const icons = [s.icon_why_1, s.icon_why_2, s.icon_why_3, s.icon_why_4, s.icon_why_5, s.icon_why_6];

  return (
    <section className="py-16 sm:py-24 bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("কেন আমরা", "Why Choose Us")}
          </span>
          <h2 className="font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("কেন আমাদের হাসপাতাল", "Why Choose")}
            <br />
            <span className="text-blue-600">{t("বেছে নেবেন?", "Our Hospital?")}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমরা শুধু চিকিৎসা দিই না, আমরা আপনার সুস্বাস্থ্য নিশ্চিত করি।", "We don't just treat — we ensure your well-being.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {REASONS.map((reason, i) => (
            <div key={reason.titleEn}
              className="group bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center text-2xl flex-shrink-0 transition-colors duration-300">
                  {icons[i] || "✦"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-blue-200 text-xs font-bold mb-1 group-hover:text-blue-400 transition-colors">{reason.num}</p>
                  <h3 className="font-bold text-gray-900 mb-1.5 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
                    {t(reason.titleBn, reason.titleEn)}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{t(reason.descBn, reason.descEn)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
