"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { DOCTORS } from "@/lib/config/siteConfig";

export function DoctorsSection() {
  const { t } = useLang();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
            {t("আমাদের চিকিৎসক", "Our Doctors")}
          </span>
          <h2 className="font-extrabold text-gray-900 mt-2 mb-3" style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)" }}>
            {t("অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক দল", "Experienced Specialist Team")}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমাদের চিকিৎসকরা আপনার চোখের সর্বোত্তম যত্নে প্রতিশ্রুতিবদ্ধ।", "Our doctors are committed to providing the best care for your eyes.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DOCTORS.map((doctor) => (
            <div key={doctor.slug} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
              {/* Photo */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-48 sm:h-56 flex items-center justify-center">
                {doctor.image ? (
                  <img src={doctor.image} alt={t(doctor.nameBn, doctor.nameEn)} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-2">
                      <span className="text-4xl">👨‍⚕️</span>
                    </div>
                    <p className="text-blue-400 text-xs">{t("ছবি শীঘ্রই আসছে", "Photo coming soon")}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {t(doctor.nameBn, doctor.nameEn)}
                </h3>
                <p className="text-blue-600 text-sm font-medium mt-0.5">{t(doctor.designationBn, doctor.designationEn)}</p>
                <p className="text-gray-400 text-xs mt-1">{t(doctor.qualificationBn, doctor.qualificationEn)}</p>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                    {t(doctor.specialtyBn, doctor.specialtyEn)}
                  </span>
                  <Link href={`/doctors/${doctor.slug}`} className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 transition-colors">
                    {t("প্রোফাইল", "Profile")} <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/doctors" className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-7 py-3 rounded-xl transition-colors text-sm">
            {t("সকল চিকিৎসক দেখুন", "View All Doctors")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
