"use client";

import Link from "next/link";
import { CalendarCheck, Clock } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { Doctor } from "@/types/doctor";
import { DoctorPhoto } from "./DoctorPhoto";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const { t } = useLang();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 hover:border-primary-200 transition-all group flex flex-col">
      {/* Photo */}
      <div className="h-56 overflow-hidden flex-shrink-0">
        <DoctorPhoto
          photo={doctor.photo}
          name={t(doctor.nameBn, doctor.nameEn)}
        />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
          {t(doctor.nameBn, doctor.nameEn)}
        </h3>
        <p className="text-primary-600 text-sm font-medium mt-0.5">
          {t(doctor.designationBn, doctor.designationEn)}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {t(doctor.qualificationBn, doctor.qualificationEn)}
        </p>

        {/* Specialty badge */}
        <div className="mt-3">
          <span className="inline-block bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {t(doctor.specialtyBn, doctor.specialtyEn)}
          </span>
        </div>

        {/* Experience */}
        <p className="text-gray-500 text-xs mt-2 flex items-center gap-1.5">
          <Clock size={12} className="text-primary-400" />
          {t(doctor.experienceBn, doctor.experienceEn)}
        </p>

        {/* Schedule preview */}
        {doctor.schedule.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-1.5">
              {t("চেম্বার সময়সূচি", "Chamber Schedule")}
            </p>
            <div className="space-y-1">
              {doctor.schedule.slice(0, 2).map((slot, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium text-gray-700">
                    {t(slot.dayBn, slot.dayEn)}
                  </span>
                  <span>{t(slot.timeBn, slot.timeEn)}</span>
                </div>
              ))}
              {doctor.schedule.length > 2 && (
                <p className="text-xs text-primary-500">
                  +{doctor.schedule.length - 2} {t("আরও", "more")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 mt-auto">
          <Link
            href={`/doctors/${doctor.id}`}
            className="flex-1 text-center border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            {t("প্রোফাইল দেখুন", "View Profile")}
          </Link>
          <Link
            href={`/appointment?doctor=${doctor.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <CalendarCheck size={13} />
            {t("অ্যাপয়েন্টমেন্ট", "Appointment")}
          </Link>
        </div>
      </div>
    </div>
  );
}
