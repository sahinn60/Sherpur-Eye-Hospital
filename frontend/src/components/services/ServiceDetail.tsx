"use client";

import Link from "next/link";
import { CalendarCheck, ChevronLeft, User } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useServiceById } from "@/hooks/useServices";
import { ServiceDetailSkeleton } from "./ServiceSkeleton";
import { HOSPITAL_INFO } from "@/lib/config/siteConfig";

interface ServiceDetailProps {
  id: string;
}

export function ServiceDetail({ id }: ServiceDetailProps) {
  const { t } = useLang();
  const { data: service, loading, error } = useServiceById(id);

  if (loading) return <ServiceDetailSkeleton />;

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          {t("সেবাটি পাওয়া যায়নি", "Service not found")}
        </h3>
        <Link href="/services" className="text-primary-600 hover:underline text-sm">
          {t("← সকল সেবা দেখুন", "← View all services")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium mb-8 transition-colors"
      >
        <ChevronLeft size={16} />
        {t("সকল সেবা", "All Services")}
      </Link>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left sidebar */}
        <div className="space-y-5">
          {/* Icon / Image */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {service.image ? (
              <img
                src={service.image}
                alt={t(service.nameBn, service.nameEn)}
                className="w-full h-52 object-cover"
              />
            ) : (
              <div className="h-52 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                <span className="text-8xl">{service.icon}</span>
              </div>
            )}
          </div>

          {/* Related doctor */}
          {service.doctor && (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t("সংশ্লিষ্ট চিকিৎসক", "Related Doctor")}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {service.doctor.photo ? (
                    <img src={service.doctor.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-primary-500" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {t(service.doctor.nameBn, service.doctor.nameEn)}
                  </p>
                  <p className="text-primary-600 text-xs">
                    {t(service.doctor.designationBn, service.doctor.designationEn)}
                  </p>
                </div>
              </div>
              <Link
                href={`/doctors/${service.doctor.id}`}
                className="mt-3 block text-center text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
              >
                {t("প্রোফাইল দেখুন →", "View Profile →")}
              </Link>
            </div>
          )}

          {/* Appointment CTA */}
          <Link
            href={`/appointment?service=${service.id}`}
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <CalendarCheck size={18} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>

          {/* Emergency contact */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <p className="text-red-700 text-xs font-semibold mb-1">
              {t("জরুরি যোগাযোগ", "Emergency Contact")}
            </p>
            <a
              href={`tel:${HOSPITAL_INFO.emergency}`}
              className="text-red-600 font-bold text-sm hover:underline"
            >
              {HOSPITAL_INFO.emergency}
            </a>
          </div>
        </div>

        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <span className="inline-block bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {service.icon} {getCategoryLabel(service.category, t)}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {t(service.nameBn, service.nameEn)}
            </h1>
            <p className="text-gray-500 mt-2 text-lg leading-relaxed">
              {t(service.shortDescBn, service.shortDescEn)}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Full description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              {t("বিস্তারিত বিবরণ", "Detailed Description")}
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {t(service.fullDescBn, service.fullDescEn)}
            </div>
          </div>

          {/* Info note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
            💡 {t(
              "আরও তথ্যের জন্য বা অ্যাপয়েন্টমেন্ট নিতে আমাদের সাথে যোগাযোগ করুন।",
              "Contact us for more information or to book an appointment."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryLabel(
  category: string,
  t: (bn: string, en: string) => string
): string {
  const map: Record<string, [string, string]> = {
    GENERAL:     ["সাধারণ চক্ষু সেবা", "General Eye Care"],
    CATARACT:    ["ছানি চিকিৎসা", "Cataract"],
    PHACO:       ["ফ্যাকো সার্জারি", "Phaco Surgery"],
    GLAUCOMA:    ["গ্লুকোমা", "Glaucoma"],
    RETINA:      ["রেটিনা", "Retina"],
    CORNEA:      ["কর্নিয়া", "Cornea"],
    PEDIATRIC:   ["শিশু চক্ষু", "Pediatric Eye Care"],
    DIABETIC:    ["ডায়াবেটিক চক্ষু", "Diabetic Eye Care"],
    EXAMINATION: ["চোখের পরীক্ষা", "Eye Examination"],
    OTHER:       ["অন্যান্য", "Other"],
  };
  const [bn, en] = map[category] ?? ["সেবা", "Service"];
  return t(bn, en);
}
