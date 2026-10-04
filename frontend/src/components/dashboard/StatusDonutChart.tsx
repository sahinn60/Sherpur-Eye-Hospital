"use client";

const STATUS_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  PENDING:   { color: "#f59e0b", label: "অপেক্ষমাণ", bg: "#fffbeb" },
  CONFIRMED: { color: "#10b981", label: "নিশ্চিত",   bg: "#ecfdf5" },
  COMPLETED: { color: "#3b82f6", label: "সম্পন্ন",   bg: "#eff6ff" },
  CANCELLED: { color: "#ef4444", label: "বাতিল",     bg: "#fef2f2" },
  NO_SHOW:   { color: "#8b5cf6", label: "অনুপস্থিত", bg: "#f5f3ff" },
};

interface DonutChartProps {
  data: { status: string; count: number }[];
  title: string;
}

export function StatusDonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const R = 48; const cx = 64; const cy = 64;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = total > 0 ? d.count / total : 0;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = { ...d, dash, gap, offset, pct };
    offset += dash;
    return slice;
  });

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="mb-5">
        <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>অ্যাপয়েন্টমেন্ট স্ট্যাটাস বিভাজন</p>
      </div>

      {total === 0 ? (
        <div className="flex items-center justify-center" style={{ height: 160, color: "#94a3b8", fontSize: 14 }}>
          কোনো ডেটা নেই
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <svg width={128} height={128} viewBox="0 0 128 128" className="shrink-0">
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="#f1f5f9" strokeWidth={16} />
            {slices.map((s) => (
              <circle
                key={s.status}
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={STATUS_CONFIG[s.status]?.color || "#94a3b8"}
                strokeWidth={16}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, transition: "stroke-dasharray 0.5s ease" }}
              />
            ))}
            <text x={cx} y={cy - 7} textAnchor="middle" fontSize={18} fontWeight="800" fill="#0f172a">{total}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="#94a3b8">মোট</text>
          </svg>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {slices.map((s) => {
              const cfg = STATUS_CONFIG[s.status] || { color: "#94a3b8", label: s.status, bg: "#f8fafc" };
              return (
                <div key={s.status} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={{ background: cfg.bg }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
                  <span className="text-xs font-medium truncate flex-1" style={{ color: "#475569" }}>{cfg.label}</span>
                  <span className="text-xs font-bold shrink-0" style={{ color: cfg.color }}>{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
