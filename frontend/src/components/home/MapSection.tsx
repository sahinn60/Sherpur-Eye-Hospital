"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export function MapSection() {
  const { t } = useLang();
  const { s } = useSiteSettings();

  const details = [
    { icon: <MapPin size={16} />, labelBn: "ঠিকানা", labelEn: "Address", valueBn: s.contact_address_bn || "শেরপুর সদর, শেরপুর", valueEn: s.contact_address_en || "Sherpur Sadar, Sherpur" },
    { icon: <Phone size={16} />, labelBn: "ফোন", labelEn: "Phone", valueBn: s.contact_phone || "01781-836581", valueEn: s.contact_phone || "01781-836581" },
    { icon: <Mail size={16} />, labelBn: "ইমেইল", labelEn: "Email", valueBn: s.contact_email || s.email || "", valueEn: s.contact_email || s.email || "" },
    { icon: <Clock size={16} />, labelBn: "সময়সূচি", labelEn: "Hours", valueBn: s.hours_weekday_bn || "শনি–বৃহস্পতি: সকাল ৮টা – রাত ৮টা", valueEn: s.hours_weekday_en || "Sat–Thu: 8:00 AM – 8:00 PM" },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
            {t("আমাদের অবস্থান", "Our Location")}
          </span>
          <h2 className="font-extrabold text-gray-900 mt-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("আমাদের খুঁজে পান", "Find Us")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md border border-gray-200 h-64 sm:h-80">
            <iframe
              src="https://maps.google.com/maps?q=Sherpur+Adhunik+Eye+Hospital+Sherpur+Bangladesh&output=embed&hl=bn"
              width="100%" height="100%"
              style={{ border: 0 }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t("হাসপাতালের অবস্থান", "Hospital Location")}
            />
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            {details.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                    {t(item.labelBn, item.labelEn)}
                  </p>
                  <p className="text-gray-700 text-sm">{t(item.valueBn, item.valueEn)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
