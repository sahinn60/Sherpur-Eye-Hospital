"use client";

import Image from "next/image";
import { Eye, Pencil, Power, Clock, UserPlus, User } from "lucide-react";
import { Employee } from "@/types/employee";

interface Props {
  employee: Employee;
  onView:          (e: Employee) => void;
  onEdit:          (e: Employee) => void;
  onToggleStatus:  (e: Employee) => void;
  onAssignShift:   (e: Employee) => void;
  onAssignAccount: (e: Employee) => void;
}

export function EmployeeRow({ employee: e, onView, onEdit, onToggleStatus, onAssignShift, onAssignAccount }: Props) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      {/* Avatar + Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 overflow-hidden shrink-0 flex items-center justify-center">
            {e.photo
              ? <Image src={e.photo} alt={e.nameEn} width={36} height={36} className="object-cover w-full h-full" />
              : <User size={16} className="text-primary-400" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{e.nameBn}</p>
            <p className="text-xs text-gray-400 font-mono">{e.employeeId}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{e.designationBn}</td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{e.department?.name || "—"}</td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden xl:table-cell">{e.shift?.name || "—"}</td>
      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{e.phone}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${e.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {e.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => onView(e)} title="দেখুন" className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye size={15} />
          </button>
          <button onClick={() => onEdit(e)} title="সম্পাদনা" className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors">
            <Pencil size={15} />
          </button>
          <button onClick={() => onAssignShift(e)} title="শিফট" className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors">
            <Clock size={15} />
          </button>
          {!e.user && (
            <button onClick={() => onAssignAccount(e)} title="অ্যাকাউন্ট" className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors">
              <UserPlus size={15} />
            </button>
          )}
          <button onClick={() => onToggleStatus(e)} title={e.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
            className={`p-1.5 rounded-lg transition-colors ${e.isActive ? "hover:bg-red-50 text-gray-400 hover:text-red-600" : "hover:bg-emerald-50 text-gray-400 hover:text-emerald-600"}`}>
            <Power size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
