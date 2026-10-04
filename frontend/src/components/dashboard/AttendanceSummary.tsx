"use client";

interface AttendanceSummaryProps {
  present: number;
  absent: number;
  late: number;
  loading?: boolean;
}

const BARS = [
  { key: "present", label: "উপস্থিত",   color: "#10b981", bg: "#ecfdf5", text: "#059669" },
  { key: "absent",  label: "অনুপস্থিত", color: "#ef4444", bg: "#fef2f2", text: "#dc2626" },
  { key: "late",    label: "দেরিতে",    color: "#f59e0b", bg: "#fffbeb", text: "#d97706" },
];

export function AttendanceSummary({ present, absent, late, loading }: AttendanceSummaryProps) {
  const vals: Record<string, number> = { present, absent, late };
  const total = present + absent + late;

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="mb-5">
        <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>আজকের উপস্থিতি</p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>মোট রেকর্ড: {total} জন</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "#f8fafc" }} />)}
        </div>
      ) : total === 0 ? (
        <div className="flex items-center justify-center py-8" style={{ color: "#94a3b8", fontSize: 14 }}>
          আজকের উপস্থিতি রেকর্ড নেই
        </div>
      ) : (
        <div className="space-y-3">
          {BARS.map((b) => {
            const val = vals[b.key];
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return (
              <div key={b.key} className="rounded-xl p-3.5" style={{ background: b.bg }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: b.text }}>{b.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: b.text }}>{val} জন</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                      style={{ background: "rgba(255,255,255,0.7)", color: b.text }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.6)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: b.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
