"use client";

import { Clock, User, Phone, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";
import { QueueItem } from "@/types/clinic";
import { GENDER_BN } from "@/types/patient";
import { Button } from "@/components/ui";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: "অপেক্ষমাণ",  cls: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "নিশ্চিত",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "সম্পন্ন",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "বাতিল",      cls: "bg-red-50 text-red-700 border-red-200" },
  NO_SHOW:   { label: "অনুপস্থিত", cls: "bg-gray-100 text-gray-500 border-gray-200" },
};

interface Props {
  queue:    QueueItem[];
  loading:  boolean;
  onSelect: (item: QueueItem) => void;
}

export function TodayQueue({ queue, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-14 text-center">
        <Stethoscope size={36} className="mx-auto text-gray-200 mb-3" />
        <p className="text-gray-400 text-sm">আজকের কোনো রোগী নেই</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {queue.map((item, idx) => {
        const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING;
        const hasVisit = !!item.visit;
        return (
          <div key={item.id}
            className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-sm ${
              hasVisit ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200"
            }`}>
            {/* Serial */}
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {idx + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900">
                  {item.patient?.nameBn || item.patientName}
                </p>
                {item.patient?.patientId && (
                  <span className="text-xs font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                    {item.patient.patientId}
                  </span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.cls}`}>
                  {cfg.label}
                </span>
                {hasVisit && (
                  <span className="text-xs text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 size={12} /> ভিজিট হয়েছে
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1"><Clock size={11} /> {item.preferredTime}</span>
                <span className="flex items-center gap-1"><Phone size={11} /> {item.phone}</span>
                <span className="flex items-center gap-1"><User size={11} /> {item.age} বছর · {GENDER_BN[item.gender]}</span>
                {item.service && <span className="text-primary-600">{item.service.nameBn}</span>}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{item.reason}</p>
            </div>

            {/* Action */}
            <Button size="sm" variant={hasVisit ? "secondary" : "primary"} onClick={() => onSelect(item)}
              className="flex-shrink-0">
              {hasVisit ? "দেখুন" : "শুরু করুন"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
