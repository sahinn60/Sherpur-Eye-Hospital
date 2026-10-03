"use client";

import Image from "next/image";
import { Eye, Pencil, ToggleLeft, ToggleRight, ShieldPlus, User } from "lucide-react";
import { DoctorAdmin } from "@/types/doctor";

interface Props {
  doctor:          DoctorAdmin;
  onView:          (d: DoctorAdmin) => void;
  onEdit:          (d: DoctorAdmin) => void;
  onToggleStatus:  (d: DoctorAdmin) => void;
  onAssignAccount: (d: DoctorAdmin) => void;
}

export function DoctorRow({ doctor, onView, onEdit, onToggleStatus, onAssignAccount }: Props) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Doctor info */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 overflow-hidden shrink-0 flex items-center justify-center">
            {doctor.photo
              ? <Image src={doctor.photo} alt={doctor.nameEn} width={36} height={36} className="object-cover w-full h-full" />
              : <User size={16} className="text-primary-400" />
            }
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{doctor.nameBn}</p>
            <p className="text-xs text-gray-400">{doctor.nameEn}</p>
          </div>
        </div>
      </td>

      {/* Designation */}
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-gray-700">{doctor.designationBn}</p>
        <p className="text-xs text-gray-400">{doctor.qualificationEn}</p>
      </td>

      {/* Specialty */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-sm text-gray-700">{doctor.specialtyBn}</p>
        <p className="text-xs text-gray-400">{doctor.experienceEn}</p>
      </td>

      {/* Fee */}
      <td className="px-4 py-3 hidden xl:table-cell">
        <span className="text-sm font-medium text-gray-800">
          {doctor.consultationFee > 0 ? `৳ ${doctor.consultationFee.toLocaleString()}` : "—"}
        </span>
      </td>

      {/* Account */}
      <td className="px-4 py-3 hidden sm:table-cell">
        {doctor.user
          ? <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">লগইন আছে</span>
          : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">নেই</span>
        }
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          doctor.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
        }`}>
          {doctor.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => onView(doctor)} title="বিবরণ দেখুন"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
            <Eye size={15} />
          </button>
          <button onClick={() => onEdit(doctor)} title="সম্পাদনা"
            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => onToggleStatus(doctor)} title={doctor.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
            className={`p-1.5 rounded-lg transition-colors ${
              doctor.isActive
                ? "hover:bg-red-50 text-gray-400 hover:text-red-500"
                : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"
            }`}>
            {doctor.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
          </button>
          {!doctor.user && (
            <button onClick={() => onAssignAccount(doctor)} title="লগইন অ্যাকাউন্ট দিন"
              className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors">
              <ShieldPlus size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
