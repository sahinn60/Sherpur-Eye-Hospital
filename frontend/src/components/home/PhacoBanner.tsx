"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const POINTS = [
  { bn: "ব্যথামুক্ত অপারেশন", en: "Painless Surgery" },
  { bn: "মাত্র ১৫-২০ মিনিটে সম্পন্ন", en: "Completed in 15-20 minutes" },
  { bn: "দ্রুত সুস্থতা", en: "Fast Recovery" },
  { bn: "উন্নত দৃষ্টিশক্তি", en: "Improved Vision" },
  { bn: "অভিজ্ঞ সার্জন দ্বারা পরিচালিত", en: "Performed by experienced surgeons" },
  { bn: "সাশ্রয়ী মূল্যে উন্নত সেবা", en: "Premium care at affordable cost" },
];

export function PhacoBanner() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="inline-block bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              {t("বিশেষ সেবা", "Featured Service")}
            </span>
            <h2 className="font-extrabold mb-4 leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
              {t("ফ্যাকো ক্যাটারেক্ট সার্জারি", "Phaco Cataract Surgery")}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-7">
              {t(
                "ফ্যাকোইমালসিফিকেশন হলো ছানি অপারেশনের সবচেয়ে আধুনিক পদ্ধতি। এই পদ্ধতিতে অতি ক্ষুদ্র ছিদ্রের মাধ্যমে ছানি অপসারণ করে কৃত্রিম লেন্স স্থাপন করা হয়।",
                "Phacoemulsification is the most modern method of cataract surgery. The cataract is removed through a tiny incision and an artificial lens is implanted."
              )}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
              {POINTS.map((p) => (
                <li key={p.en} className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                  {t(p.bn, p.en)}
                </li>
              ))}
            </ul>
            <Link href="/services" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              {t("বিস্তারিত জানুন", "Learn More")}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center w-72">
              <div className="text-8xl mb-4">🔬</div>
              <p className="text-white font-bold text-lg mb-1">{t("ফ্যাকো সার্জারি", "Phaco Surgery")}</p>
              <p className="text-gray-400 text-sm">{t("আধুনিক ছানি অপারেশন", "Modern Cataract Surgery")}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-blue-600/20 rounded-xl p-3">
                  <p className="text-blue-300 font-bold text-lg">১৫</p>
                  <p className="text-gray-400 text-xs">{t("মিনিট", "Minutes")}</p>
                </div>
                <div className="bg-green-600/20 rounded-xl p-3">
                  <p className="text-green-300 font-bold text-lg">১০০%</p>
                  <p className="text-gray-400 text-xs">{t("ব্যথামুক্ত", "Painless")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
