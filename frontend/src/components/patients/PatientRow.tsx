"use client";

import { useRouter } from "next/navigation";
import { Phone, MapPin, User, Edit2, ToggleLeft, ToggleRight, Eye, FilePlus } from "lucide-react";
import { Patient, GENDER_BN } from "@/types/patient";

interface Props {
  patient:    Patient;
  onView:     (p: Patient) => void;
  onEdit:     (p: Patient) => void;
  onToggle:   (p: Patient) => void;
  canWrite:   boolean;
}

export function PatientRow({ patient, onView, onEdit, onToggle, canWrite }: Props) {
  const router = useRouter();
  const initials = patient.nameBn.slice(0, 2);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{patient.nameBn}</p>
            <p className="text-xs text-gray-400">{patient.nameEn}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
          {patient.patientId}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone size={12} className="text-gray-400" />
          {patient.phone}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <User size={12} className="text-gray-400" />
          {patient.age ? `${patient.age} বছর` : "—"} · {GENDER_BN[patient.gender]}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate">
        {patient.address ? (
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400 flex-shrink-0" />
            <span className="truncate">{patient.address}</span>
          </div>
        ) : "—"}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{patient._count.visits} ভিজিট</span>
          <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">{patient._count.prescriptions} Rx</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
          patient.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
        }`}>
          {patient.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => onView(patient)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title="প্রোফাইল দেখুন">
            <Eye size={15} />
          </button>
          {canWrite && (
            <>
              <button
                onClick={() => router.push(`/dashboard/patients/${patient.id}/prescription/new`)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                title="নতুন প্রেসক্রিপশন">
                <FilePlus size={15} />
              </button>
              <button onClick={() => onEdit(patient)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="সম্পাদনা">
                <Edit2 size={15} />
              </button>
              <button onClick={() => onToggle(patient)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title={patient.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}>
                {patient.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
