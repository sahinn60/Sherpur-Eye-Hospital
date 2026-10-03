"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";

export function PhacoBanner() {
  const { t } = useLang();

  const points = [
    { bn: "ব্যথামুক্ত অপারেশন", en: "Painless Surgery" },
    { bn: "মাত্র ১৫-২০ মিনিটে সম্পন্ন", en: "Completed in 15-20 minutes" },
    { bn: "দ্রুত সুস্থতা", en: "Fast Recovery" },
    { bn: "উন্নত দৃষ্টিশক্তি", en: "Improved Vision" },
    { bn: "অভিজ্ঞ সার্জন দ্বারা পরিচালিত", en: "Performed by experienced surgeons" },
    { bn: "সাশ্রয়ী মূল্যে উন্নত সেবা", en: "Premium care at affordable cost" },
  ];

  return (
    <section className="py-16 md:py-20 bg-primary-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block bg-primary-700 text-primary-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              {t("বিশেষ সেবা", "Featured Service")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {t("ফ্যাকো ক্যাটারেক্ট সার্জারি", "Phaco Cataract Surgery")}
            </h2>
            <p className="text-primary-200 leading-relaxed mb-8">
              {t(
                "ফ্যাকোইমালসিফিকেশন হলো ছানি অপারেশনের সবচেয়ে আধুনিক পদ্ধতি। এই পদ্ধতিতে অতি ক্ষুদ্র ছিদ্রের মাধ্যমে ছানি অপসারণ করে কৃত্রিম লেন্স স্থাপন করা হয়। এটি সম্পূর্ণ নিরাপদ, ব্যথামুক্ত এবং দ্রুত সুস্থতা নিশ্চিত করে।",
                "Phacoemulsification is the most modern method of cataract surgery. In this method, the cataract is removed through a tiny incision and an artificial lens is implanted. It is completely safe, painless, and ensures fast recovery."
              )}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {points.map((p) => (
                <li key={p.en} className="flex items-center gap-3 text-primary-100 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {t(p.bn, p.en)}
                </li>
              ))}
            </ul>

            <Link
              href="/services/phaco-cataract"
              className="inline-flex items-center gap-2 bg-white text-primary-800 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              {t("বিস্তারিত জানুন", "Learn More")}
            </Link>
          </div>

          {/* Visual */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-primary-700/50 border border-primary-500/30" />
              <div className="absolute inset-8 rounded-full bg-primary-600/40 border border-primary-400/30" />
              <div className="absolute inset-16 rounded-full bg-primary-500/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🔬</div>
                  <p className="text-white text-xs font-semibold">
                    {t("ফ্যাকো সার্জারি", "Phaco Surgery")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
