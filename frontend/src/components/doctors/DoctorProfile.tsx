"use client";

import Link from "next/link";
import { CalendarCheck, Clock, GraduationCap, Stethoscope, ChevronLeft } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useDoctorById } from "@/hooks/useDoctors";
import { DoctorPhoto } from "./DoctorPhoto";
import { DoctorProfileSkeleton } from "./DoctorSkeleton";
import { ErrorState } from "./ErrorState";

interface DoctorProfileProps {
  id: string;
}

export function DoctorProfile({ id }: DoctorProfileProps) {
  const { t } = useLang();
  const { data: doctor, loading, error } = useDoctorById(id);

  if (loading) return <DoctorProfileSkeleton />;

  if (error || !doctor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ErrorState message={error ?? undefined} />
      </div>
    );
  }

  const name = t(doctor.nameBn, doctor.nameEn);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium mb-8 transition-colors"
      >
        <ChevronLeft size={16} />
        {t("সকল চিকিৎসক", "All Doctors")}
      </Link>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left: photo + quick info */}
        <div className="space-y-4">
          {/* Photo */}
          <div className="rounded-2xl overflow-hidden h-72 md:h-80 border border-gray-100 shadow-sm">
            <DoctorPhoto photo={doctor.photo} name={name} />
          </div>

          {/* Quick info card */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
            <InfoRow
              icon={<GraduationCap size={15} className="text-primary-500" />}
              label={t("যোগ্যতা", "Qualification")}
              value={t(doctor.qualificationBn, doctor.qualificationEn)}
            />
            <InfoRow
              icon={<Stethoscope size={15} className="text-primary-500" />}
              label={t("বিশেষত্ব", "Specialty")}
              value={t(doctor.specialtyBn, doctor.specialtyEn)}
            />
            <InfoRow
              icon={<Clock size={15} className="text-primary-500" />}
              label={t("অভিজ্ঞতা", "Experience")}
              value={t(doctor.experienceBn, doctor.experienceEn)}
            />
          </div>

          {/* Appointment CTA */}
          <Link
            href={`/appointment?doctor=${doctor.id}`}
            className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            <CalendarCheck size={18} />
            {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
          </Link>
        </div>

        {/* Right: details */}
        <div className="md:col-span-2 space-y-7">
          {/* Name & designation */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-primary-600 font-semibold text-lg mt-1">
              {t(doctor.designationBn, doctor.designationEn)}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {t(doctor.qualificationBn, doctor.qualificationEn)}
            </p>
            <span className="inline-block mt-3 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
              {t(doctor.specialtyBn, doctor.specialtyEn)}
            </span>
          </div>

          {/* Biography */}
          {(doctor.biographyBn || doctor.biographyEn) && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {t("পরিচিতি", "Biography")}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(doctor.biographyBn ?? "", doctor.biographyEn ?? "")}
              </p>
            </div>
          )}

          {/* Schedule */}
          {doctor.schedule.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {t("পরামর্শের সময়সূচি", "Consultation Schedule")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {doctor.schedule.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-primary-50 border border-primary-100 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      <span className="font-semibold text-gray-800 text-sm">
                        {t(slot.dayBn, slot.dayEn)}
                      </span>
                    </div>
                    <span className="text-primary-700 text-sm font-medium">
                      {t(slot.timeBn, slot.timeEn)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
            💡 {t(
              "অ্যাপয়েন্টমেন্ট নিশ্চিত করতে ফোনে যোগাযোগ করুন অথবা অনলাইনে বুক করুন।",
              "Contact by phone or book online to confirm your appointment."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-gray-800 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
