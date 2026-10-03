"use client";

import Link from "next/link";

const STATUS_STYLE: Record<string, string> = {
  PENDING:   "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  NO_SHOW:   "bg-purple-50 text-purple-700 border-purple-200",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:   "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত",
  COMPLETED: "সম্পন্ন",
  CANCELLED: "বাতিল",
  NO_SHOW:   "অনুপস্থিত",
};

interface Appointment {
  id: string;
  requestId: string;
  patientName: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  doctor: { nameBn: string; nameEn: string } | null;
}

interface RecentAppointmentsProps {
  data: Appointment[];
  loading?: boolean;
}

export function RecentAppointments({ data, loading }: RecentAppointmentsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-700">সাম্প্রতিক অ্যাপয়েন্টমেন্ট</p>
        <Link href="/dashboard/appointments" className="text-xs text-primary-600 hover:underline">
          সব দেখুন →
        </Link>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">কোনো অ্যাপয়েন্টমেন্ট নেই</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">আইডি</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">রোগী</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">চিকিৎসক</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">তারিখ</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">অবস্থা</th>
              </tr>
            </thead>
            <tbody>
              {data.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gray-500 font-mono">{apt.requestId}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{apt.patientName}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                    {apt.doctor?.nameBn || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell text-xs">
                    {new Date(apt.preferredDate).toLocaleDateString("bn-BD")} {apt.preferredTime}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLE[apt.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                      {STATUS_LABEL[apt.status] || apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
