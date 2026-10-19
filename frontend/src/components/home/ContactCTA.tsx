"use client";

import Link from "next/link";
import { Phone, CalendarCheck, MapPin, Clock } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function ContactCTA() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="py-16 sm:py-24 bg-gray-950 text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-blue-600 opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-800 opacity-10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <span className="inline-block bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              {t("যোগাযোগ করুন", "Contact Us")}
            </span>
            <h2 className="font-extrabold leading-tight mb-5"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              {t("আজই আমাদের সাথে", "Get in Touch")}
              <br />
              <span className="text-blue-400">{t("যোগাযোগ করুন", "With Us Today")}</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}>
              {t("চোখের যেকোনো সমস্যায় দেরি না করে আজই বিশেষজ্ঞ পরামর্শ নিন।", "Don't delay — consult our specialists today for any eye problem.")}
            </p>

            <div className="space-y-4 mb-9">
              {[
                { icon: MapPin, bn: s.contact_address_bn || "শেরপুর সদর, শেরপুর", en: s.contact_address_en || "Sherpur Sadar, Sherpur" },
                { icon: Phone, bn: s.contact_phone || "01781-836581", en: s.contact_phone || "01781-836581" },
                { icon: Clock, bn: s.hours_weekday_bn || "শনি–বৃহস্পতি: সকাল ৮টা – রাত ৮টা", en: s.hours_weekday_en || "Sat–Thu: 8:00 AM – 8:00 PM" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={15} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300 text-sm leading-relaxed">{t(item.bn, item.en)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/appointment"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-2xl transition-all text-sm">
                <CalendarCheck size={17} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <a href={`tel:${s.contact_phone || "01781836581"}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white/10 font-bold px-7 py-3.5 rounded-2xl transition-all text-sm">
                <Phone size={17} />
                {t("এখনই কল করুন", "Call Now")}
              </a>
            </div>
          </div>

          {/* Right — schedule card */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl">
            <h3 className="font-extrabold text-gray-900 text-xl mb-6">{t("হাসপাতালের সময়সূচি", "Hospital Hours")}</h3>
            <div className="space-y-0">
              {[
                { dayBn: "শনিবার – বৃহস্পতিবার", dayEn: "Saturday – Thursday", timeBn: "সকাল ৮টা – রাত ৮টা", timeEn: "8:00 AM – 8:00 PM", highlight: false },
                { dayBn: "শুক্রবার", dayEn: "Friday", timeBn: "সকাল ১০টা – দুপুর ১টা", timeEn: "10:00 AM – 1:00 PM", highlight: false },
                { dayBn: "জরুরি সেবা", dayEn: "Emergency", timeBn: "২৪ ঘণ্টা", timeEn: "24 Hours", highlight: true },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between py-4 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                  <span className="text-gray-600 text-sm font-medium">{t(row.dayBn, row.dayEn)}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${row.highlight ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-700"}`}>
                    {t(row.timeBn, row.timeEn)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/contact"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all text-sm">
                {t("যোগাযোগ পেজ দেখুন →", "View Contact Page →")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
