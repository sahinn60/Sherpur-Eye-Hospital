"use client";

import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { DOCTORS } from "@/lib/config/siteConfig";

export function DoctorsSection() {
  const { t } = useLang();

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            {t("আমাদের চিকিৎসক", "Our Doctors")}
          </span>
          <h2 className="font-extrabold text-gray-900 leading-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {t("অভিজ্ঞ বিশেষজ্ঞ", "Experienced Specialist")}
            <br />
            <span className="text-blue-600">{t("চিকিৎসক দল", "Medical Team")}</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {t("আমাদের চিকিৎসকরা আপনার চোখের সর্বোত্তম যত্নে প্রতিশ্রুতিবদ্ধ।", "Our doctors are committed to providing the best care for your eyes.")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCTORS.map((doctor) => (
            <div key={doctor.slug}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              {/* Photo */}
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 h-52 sm:h-60 overflow-hidden">
                {doctor.image ? (
                  <img src={doctor.image} alt={t(doctor.nameBn, doctor.nameEn)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-3">
                      <Stethoscope size={36} className="text-blue-500" />
                    </div>
                    <p className="text-blue-400 text-xs">{t("ছবি শীঘ্রই আসছে", "Photo coming soon")}</p>
                  </div>
                )}
                {/* Specialty badge */}
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {t(doctor.specialtyBn, doctor.specialtyEn)}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6">
                <h3 className="text-base font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                  {t(doctor.nameBn, doctor.nameEn)}
                </h3>
                <p className="text-blue-600 text-sm font-semibold">{t(doctor.designationBn, doctor.designationEn)}</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">{t(doctor.qualificationBn, doctor.qualificationEn)}</p>

                <Link href={`/doctors/${doctor.slug}`}
                  className="flex items-center justify-between w-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm group/btn">
                  {t("প্রোফাইল দেখুন", "View Profile")}
                  <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/doctors"
            className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold px-8 py-4 rounded-2xl transition-all text-sm">
            {t("সকল চিকিৎসক দেখুন", "View All Doctors")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
