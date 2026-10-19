"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";

const POINTS = [
  { bn: "ব্যথামুক্ত অপারেশন", en: "Painless Surgery" },
  { bn: "মাত্র ১৫-২০ মিনিটে সম্পন্ন", en: "Done in 15-20 minutes" },
  { bn: "দ্রুত সুস্থতা", en: "Fast Recovery" },
  { bn: "উন্নত দৃষ্টিশক্তি", en: "Improved Vision" },
  { bn: "অভিজ্ঞ সার্জন দ্বারা পরিচালিত", en: "By experienced surgeons" },
  { bn: "সাশ্রয়ী মূল্যে উন্নত সেবা", en: "Premium care, affordable cost" },
];

export function PhacoBanner() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-gray-950 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 opacity-10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              {t("বিশেষ সেবা", "Featured Service")}
            </span>
            <h2 className="font-extrabold leading-tight mb-5"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              {t("ফ্যাকো ক্যাটারেক্ট", "Phaco Cataract")}
              <br />
              <span className="text-blue-400">{t("সার্জারি", "Surgery")}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}>
              {t(
                "ফ্যাকোইমালসিফিকেশন হলো ছানি অপারেশনের সবচেয়ে আধুনিক পদ্ধতি। অতি ক্ষুদ্র ছিদ্রের মাধ্যমে ছানি অপসারণ করে কৃত্রিম লেন্স স্থাপন করা হয়।",
                "Phacoemulsification is the most modern cataract surgery method. The cataract is removed through a tiny incision and an artificial lens is implanted."
              )}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-9">
              {POINTS.map((p) => (
                <li key={p.en} className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
                  {t(p.bn, p.en)}
                </li>
              ))}
            </ul>

            <Link href="/services"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-all text-sm">
              {t("বিস্তারিত জানুন", "Learn More")}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Visual card */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 text-center w-full max-w-xs">
              <div className="text-7xl sm:text-8xl mb-5">🔬</div>
              <p className="text-white font-extrabold text-xl mb-1">{t("ফ্যাকো সার্জারি", "Phaco Surgery")}</p>
              <p className="text-gray-400 text-sm mb-7">{t("আধুনিক ছানি অপারেশন", "Modern Cataract Surgery")}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl p-4">
                  <p className="text-blue-300 font-extrabold text-2xl">১৫</p>
                  <p className="text-gray-400 text-xs mt-1">{t("মিনিট", "Minutes")}</p>
                </div>
                <div className="bg-emerald-600/20 border border-emerald-500/20 rounded-2xl p-4">
                  <p className="text-emerald-300 font-extrabold text-2xl">১০০%</p>
                  <p className="text-gray-400 text-xs mt-1">{t("ব্যথামুক্ত", "Painless")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
