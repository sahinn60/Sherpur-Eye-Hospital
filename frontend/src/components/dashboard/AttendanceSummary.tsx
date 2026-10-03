"use client";

interface AttendanceSummaryProps {
  present: number;
  absent: number;
  late: number;
  loading?: boolean;
}

export function AttendanceSummary({ present, absent, late, loading }: AttendanceSummaryProps) {
  const total = present + absent + late;

  const bars = [
    { label: "উপস্থিত", value: present, color: "bg-emerald-500" },
    { label: "অনুপস্থিত", value: absent, color: "bg-red-400" },
    { label: "দেরিতে", value: late, color: "bg-amber-400" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">আজকের উপস্থিতি</p>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
        </div>
      ) : total === 0 ? (
        <div className="h-24 flex items-center justify-center text-gray-400 text-sm">
          আজকের উপস্থিতি রেকর্ড নেই
        </div>
      ) : (
        <div className="space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{b.label}</span>
                <span className="font-semibold">{b.value} জন</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${b.color}`}
                  style={{ width: total > 0 ? `${(b.value / total) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 pt-1">মোট কর্মচারী রেকর্ড: {total} জন</p>
        </div>
      )}
    </div>
  );
}
