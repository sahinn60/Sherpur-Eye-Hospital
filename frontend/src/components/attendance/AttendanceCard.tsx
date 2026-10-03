"use client";

import Image from "next/image";
import { MapPin, Clock, CheckCircle2, LogIn, LogOut, AlertCircle } from "lucide-react";
import { AttendanceRecord } from "@/types/attendance";

interface Props {
  record:       AttendanceRecord | null;
  onCheckIn:    () => void;
  onCheckOut:   () => void;
  loading:      boolean;
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function fmtMins(mins: number): string {
  if (mins <= 0) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h} ঘণ্টা ${m} মিনিট`;
  return `${m} মিনিট`;
}

const STATUS_CONFIG = {
  PRESENT: { label: "উপস্থিত",  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  LATE:    { label: "দেরিতে",   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  ABSENT:  { label: "অনুপস্থিত",bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
  LEAVE:   { label: "ছুটি",     bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  HOLIDAY: { label: "ছুটির দিন",bg: "bg-purple-50",  text: "text-purple-700",  border: "border-purple-200" },
};

export function AttendanceCard({ record, onCheckIn, onCheckOut, loading }: Props) {
  const today = new Date().toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const hasCheckedIn  = !!record?.checkIn;
  const hasCheckedOut = !!record?.checkOut;
  const status        = record?.status;
  const cfg           = status ? STATUS_CONFIG[status] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Date header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-4">
        <p className="text-primary-100 text-xs">আজকের তারিখ</p>
        <p className="text-white font-semibold text-base mt-0.5">{today}</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Status badge */}
        {cfg && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
            <CheckCircle2 size={16} className={cfg.text} />
            <span className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</span>
            {status === "LATE" && record!.lateMinutes > 0 && (
              <span className={`text-xs ml-auto ${cfg.text}`}>
                {fmtMins(record!.lateMinutes)} দেরি
              </span>
            )}
          </div>
        )}

        {/* Check-in / Check-out times */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-xl p-3 ${hasCheckedIn ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50 border border-gray-100"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <LogIn size={13} className={hasCheckedIn ? "text-emerald-600" : "text-gray-400"} />
              <span className="text-xs text-gray-500">চেক-ইন</span>
            </div>
            <p className={`text-lg font-bold ${hasCheckedIn ? "text-emerald-700" : "text-gray-300"}`}>
              {fmt(record?.checkIn ?? null)}
            </p>
            {record?.checkInLatitude && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-gray-400" />
                <span className="text-xs text-gray-400">লোকেশন আছে</span>
              </div>
            )}
          </div>

          <div className={`rounded-xl p-3 ${hasCheckedOut ? "bg-blue-50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <LogOut size={13} className={hasCheckedOut ? "text-blue-600" : "text-gray-400"} />
              <span className="text-xs text-gray-500">চেক-আউট</span>
            </div>
            <p className={`text-lg font-bold ${hasCheckedOut ? "text-blue-700" : "text-gray-300"}`}>
              {fmt(record?.checkOut ?? null)}
            </p>
            {record?.earlyCheckoutMinutes != null && record.earlyCheckoutMinutes > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle size={10} className="text-amber-500" />
                <span className="text-xs text-amber-600">{fmtMins(record.earlyCheckoutMinutes)} আগে</span>
              </div>
            )}
          </div>
        </div>

        {/* Working hours */}
        {hasCheckedIn && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
            <Clock size={15} className="text-gray-400" />
            <span className="text-sm text-gray-500">কাজের সময়:</span>
            <span className="text-sm font-semibold text-gray-800 ml-auto">
              {hasCheckedOut ? fmtMins(record!.workingMinutes) : "চলমান..."}
            </span>
          </div>
        )}

        {/* Selfie thumbnails */}
        {(record?.checkInSelfie || record?.checkOutSelfie) && (
          <div className="flex gap-3">
            {record.checkInSelfie && (
              <div className="flex flex-col items-center gap-1">
                <Image src={record.checkInSelfie} alt="check-in selfie"
                  width={56} height={56}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-200" />
                <span className="text-xs text-gray-400">চেক-ইন</span>
              </div>
            )}
            {record.checkOutSelfie && (
              <div className="flex flex-col items-center gap-1">
                <Image src={record.checkOutSelfie} alt="check-out selfie"
                  width={56} height={56}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-blue-200" />
                <span className="text-xs text-gray-400">চেক-আউট</span>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="pt-1">
          {!hasCheckedIn ? (
            <button onClick={onCheckIn} disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200">
              <LogIn size={20} />
              চেক-ইন করুন
            </button>
          ) : !hasCheckedOut ? (
            <button onClick={onCheckOut} disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50 text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-200">
              <LogOut size={20} />
              চেক-আউট করুন
            </button>
          ) : (
            <div className="w-full py-4 rounded-2xl bg-gray-100 text-gray-500 font-medium text-base flex items-center justify-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              আজকের উপস্থিতি সম্পন্ন
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
