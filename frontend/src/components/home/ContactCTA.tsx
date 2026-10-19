"use client";

import Link from "next/link";
import { Phone, CalendarCheck, MapPin, Clock } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function ContactCTA() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  return (
    <section className="py-14 sm:py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div className="text-white">
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
              {t("যোগাযোগ করুন", "Contact Us")}
            </span>
            <h2 className="font-extrabold mt-2 mb-4 leading-tight" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
              {t("আজই আমাদের সাথে যোগাযোগ করুন", "Contact Us Today")}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-lg">
              {t("চোখের যেকোনো সমস্যায় দেরি না করে আজই বিশেষজ্ঞ পরামর্শ নিন।", "Don't delay — consult our specialists today for any eye problem.")}
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: <MapPin size={16} />, bn: s.contact_address_bn || "শেরপুর সদর, শেরপুর", en: s.contact_address_en || "Sherpur Sadar, Sherpur" },
                { icon: <Phone size={16} />, bn: s.contact_phone || "01781-836581", en: s.contact_phone || "01781-836581" },
                { icon: <Clock size={16} />, bn: s.hours_weekday_bn || "শনি–বৃহস্পতি: সকাল ৮টা – রাত ৮টা", en: s.hours_weekday_en || "Sat–Thu: 8:00 AM – 8:00 PM" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-blue-100 text-sm">
                  <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span>{t(item.bn, item.en)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/appointment" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl transition-colors text-sm shadow-lg">
                <CalendarCheck size={18} />
                {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
              </Link>
              <a href={`tel:${s.contact_phone || "01781836581"}`} className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white hover:bg-white/10 font-bold px-6 py-3.5 rounded-xl transition-colors text-sm">
                <Phone size={18} />
                {t("এখনই কল করুন", "Call Now")}
              </a>
            </div>
          </div>

          {/* Right — info card */}
          <div className="bg-white rounded-3xl p-7 shadow-xl">
            <h3 className="font-bold text-gray-900 text-lg mb-5">{t("হাসপাতালের সময়সূচি", "Hospital Hours")}</h3>
            <div className="space-y-3">
              {[
                { dayBn: "শনিবার – বৃহস্পতিবার", dayEn: "Saturday – Thursday", timeBn: "সকাল ৮টা – রাত ৮টা", timeEn: "8:00 AM – 8:00 PM" },
                { dayBn: "শুক্রবার", dayEn: "Friday", timeBn: "সকাল ১০টা – দুপুর ১টা", timeEn: "10:00 AM – 1:00 PM" },
                { dayBn: "জরুরি সেবা", dayEn: "Emergency", timeBn: "২৪ ঘণ্টা", timeEn: "24 Hours" },
              ].map((row, i) => (
                <div key={i} className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-gray-100" : ""}`}>
                  <span className="text-gray-600 text-sm font-medium">{t(row.dayBn, row.dayEn)}</span>
                  <span className={`text-sm font-bold ${i === 2 ? "text-green-600" : "text-blue-700"}`}>{t(row.timeBn, row.timeEn)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <Link href="/contact" className="block text-center bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                {t("যোগাযোগ পেজ দেখুন →", "View Contact Page →")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
