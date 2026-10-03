"use client";

import Image from "next/image";
import {
  X, User, Phone, Mail, Calendar, Clock,
  Banknote, ShieldCheck, Stethoscope, BookOpen, Star,
} from "lucide-react";
import { DoctorAdmin } from "@/types/doctor";

const GENDER_LABEL: Record<string, string> = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "সুপার অ্যাডমিন", ADMIN: "অ্যাডমিন", DOCTOR: "চিকিৎসক",
};

interface Props { doctor: DoctorAdmin | null; onClose: () => void; }

function Row({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function DoctorViewDrawer({ doctor, onClose }: Props) {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-900">চিকিৎসকের বিবরণ</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 overflow-hidden shrink-0 flex items-center justify-center">
              {doctor.photo
                ? <Image src={doctor.photo} alt={doctor.nameEn} width={64} height={64} className="object-cover w-full h-full" />
                : <User size={28} className="text-primary-400" />
              }
            </div>
            <div>
              <p className="font-bold text-gray-900">{doctor.nameBn}</p>
              <p className="text-sm text-gray-500">{doctor.nameEn}</p>
              <p className="text-xs text-primary-600 mt-0.5">{doctor.designationBn}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${doctor.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  {doctor.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
                {doctor.consultationFee > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                    ৳ {doctor.consultationFee.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">

          {/* Personal */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ব্যক্তিগত তথ্য</p>
          <Row icon={Phone}    label="ফোন"       value={doctor.phone} />
          <Row icon={Mail}     label="ইমেইল"     value={doctor.email} />
          <Row icon={User}     label="লিঙ্গ"      value={GENDER_LABEL[doctor.gender]} />
          <Row icon={Calendar} label="জন্ম তারিখ" value={doctor.dateOfBirth ? new Date(doctor.dateOfBirth).toLocaleDateString("bn-BD") : null} />
          <Row icon={Calendar} label="যোগদান"    value={new Date(doctor.joiningDate).toLocaleDateString("bn-BD")} />

          {/* Professional */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">পেশাদার তথ্য</p>
          <Row icon={BookOpen}    label="যোগ্যতা"   value={`${doctor.qualificationBn} / ${doctor.qualificationEn}`} />
          <Row icon={Stethoscope} label="বিশেষত্ব"  value={`${doctor.specialtyBn} / ${doctor.specialtyEn}`} />
          <Row icon={Star}        label="অভিজ্ঞতা"  value={`${doctor.experienceBn} / ${doctor.experienceEn}`} />

          {doctor.specializations.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">বিশেষজ্ঞতা</p>
              <div className="flex flex-wrap gap-1.5">
                {doctor.specializations.map((s) => (
                  <span key={s} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Consultation */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">পরামর্শ সময়সূচি</p>
          <Row icon={Banknote} label="পরামর্শ ফি"    value={doctor.consultationFee > 0 ? `৳ ${doctor.consultationFee.toLocaleString()}` : null} />
          <Row icon={Clock}    label="চেম্বার সময়"  value={doctor.chamberSchedule} />

          {doctor.availableDays.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">উপলব্ধ দিন</p>
              <div className="flex flex-wrap gap-1.5">
                {doctor.availableDays.map((d) => (
                  <span key={d} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
            </div>
          )}

          {doctor.schedule.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5">সময়সূচি স্লট</p>
              <div className="space-y-1.5">
                {doctor.schedule.map((slot, i) => (
                  <div key={i} className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-700 font-medium">{slot.dayBn}</span>
                    <span className="text-gray-500">{slot.timeBn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Login account */}
          {doctor.user && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">লগইন অ্যাকাউন্ট</p>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <Row icon={Mail}        label="ইমেইল"    value={doctor.user.email} />
                <Row icon={ShieldCheck} label="ভূমিকা"   value={ROLE_LABEL[doctor.user.role] || doctor.user.role} />
                <Row icon={Clock}       label="শেষ লগইন" value={doctor.user.lastLoginAt ? new Date(doctor.user.lastLoginAt).toLocaleString("bn-BD") : "কখনো লগইন করেননি"} />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${doctor.user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {doctor.user.isActive ? "অ্যাকাউন্ট সক্রিয়" : "অ্যাকাউন্ট নিষ্ক্রিয়"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
