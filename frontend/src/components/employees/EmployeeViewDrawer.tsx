"use client";

import Image from "next/image";
import { X, User, Phone, Mail, MapPin, Calendar, Building2, Clock, Banknote, ShieldCheck } from "lucide-react";
import { Employee } from "@/types/employee";

const GENDER_LABEL: Record<string, string> = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "সুপার অ্যাডমিন", ADMIN: "অ্যাডমিন", HR: "এইচআর",
  DOCTOR: "চিকিৎসক", RECEPTION: "রিসেপশন", ACCOUNTANT: "হিসাবরক্ষক", EMPLOYEE: "কর্মচারী",
};

interface Props { employee: Employee | null; onClose: () => void; }

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

export function EmployeeViewDrawer({ employee, onClose }: Props) {
  if (!employee) return null;

  const netSalary = employee.basicSalary + employee.allowances - employee.deductions;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-gray-900">কর্মচারীর বিবরণ</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Profile */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 overflow-hidden shrink-0 flex items-center justify-center">
              {employee.photo
                ? <Image src={employee.photo} alt={employee.nameEn} width={64} height={64} className="object-cover w-full h-full" />
                : <User size={28} className="text-primary-400" />
              }
            </div>
            <div>
              <p className="font-bold text-gray-900">{employee.nameBn}</p>
              <p className="text-sm text-gray-500">{employee.nameEn}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{employee.employeeId}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${employee.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                  {employee.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ব্যক্তিগত তথ্য</p>
          <Row icon={Phone}    label="ফোন"       value={employee.phone} />
          <Row icon={Mail}     label="ইমেইল"     value={employee.email} />
          <Row icon={User}     label="লিঙ্গ"      value={GENDER_LABEL[employee.gender]} />
          <Row icon={Calendar} label="জন্ম তারিখ" value={employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString("bn-BD") : null} />
          <Row icon={MapPin}   label="ঠিকানা"    value={employee.address} />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">কর্মসংস্থান</p>
          <Row icon={Building2} label="বিভাগ"         value={employee.department?.name} />
          <Row icon={User}      label="পদবি"           value={`${employee.designationBn} / ${employee.designationEn}`} />
          <Row icon={Clock}     label="শিফট"           value={employee.shift ? `${employee.shift.name} (${employee.shift.startTime}–${employee.shift.endTime})` : null} />
          <Row icon={Calendar}  label="যোগদানের তারিখ" value={new Date(employee.joiningDate).toLocaleDateString("bn-BD")} />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">বেতন তথ্য</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {[
              { label: "মূল বেতন",  value: employee.basicSalary },
              { label: "ভাতা",      value: employee.allowances },
              { label: "কর্তন",     value: employee.deductions },
            ].map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-medium text-gray-800">৳ {r.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
              <span className="text-gray-700">নেট বেতন</span>
              <span className="text-primary-700">৳ {netSalary.toLocaleString()}</span>
            </div>
          </div>

          {employee.user && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">লগইন অ্যাকাউন্ট</p>
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <Row icon={Mail}        label="ইমেইল"      value={employee.user.email} />
                <Row icon={ShieldCheck} label="ভূমিকা"     value={ROLE_LABEL[employee.user.role] || employee.user.role} />
                <Row icon={Clock}       label="শেষ লগইন"   value={employee.user.lastLoginAt ? new Date(employee.user.lastLoginAt).toLocaleString("bn-BD") : "কখনো লগইন করেননি"} />
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${employee.user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {employee.user.isActive ? "অ্যাকাউন্ট সক্রিয়" : "অ্যাকাউন্ট নিষ্ক্রিয়"}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
