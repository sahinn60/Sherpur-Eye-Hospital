"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { DOCTORS } from "@/lib/config/siteConfig";

export function DoctorsSection() {
  const { t } = useLang();

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
            {t("আমাদের চিকিৎসক", "Our Doctors")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            {t("অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক দল", "Experienced Specialist Medical Team")}
          </h2>
          <p className="text-gray-500">
            {t(
              "আমাদের চিকিৎসকরা আপনার চোখের সর্বোত্তম যত্নে প্রতিশ্রুতিবদ্ধ।",
              "Our doctors are committed to providing the best care for your eyes."
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DOCTORS.map((doctor) => (
            <div
              key={doctor.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all group"
            >
              {/* Doctor image */}
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 h-52 flex items-center justify-center">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={t(doctor.nameBn, doctor.nameEn)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary-200 flex items-center justify-center mx-auto mb-3">
                      <span className="text-4xl">👨‍⚕️</span>
                    </div>
                    <p className="text-primary-400 text-xs">
                      {t("ছবি শীঘ্রই আসছে", "Photo coming soon")}
                    </p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {t(doctor.nameBn, doctor.nameEn)}
                </h3>
                <p className="text-primary-600 text-sm font-medium mt-0.5">
                  {t(doctor.designationBn, doctor.designationEn)}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {t(doctor.qualificationBn, doctor.qualificationEn)}
                </p>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {t(doctor.specialtyBn, doctor.specialtyEn)}
                  </span>
                  <Link
                    href={`/doctors/${doctor.slug}`}
                    className="text-primary-600 hover:text-primary-800 text-xs font-semibold transition-colors"
                  >
                    {t("প্রোফাইল দেখুন →", "View Profile →")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("সকল চিকিৎসক দেখুন", "View All Doctors")}
          </Link>
        </div>
      </div>
    </section>
  );
}
