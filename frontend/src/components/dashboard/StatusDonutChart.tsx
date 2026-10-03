"use client";

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "#f59e0b",
  CONFIRMED: "#10b981",
  COMPLETED: "#3b82f6",
  CANCELLED: "#ef4444",
  NO_SHOW:   "#8b5cf6",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:   "অপেক্ষমাণ",
  CONFIRMED: "নিশ্চিত",
  COMPLETED: "সম্পন্ন",
  CANCELLED: "বাতিল",
  NO_SHOW:   "অনুপস্থিত",
};

interface DonutChartProps {
  data: { status: string; count: number }[];
  title: string;
}

export function StatusDonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const R = 52;
  const cx = 70;
  const cy = 70;
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
      {total === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">কোনো ডেটা নেই</div>
      ) : (
        <div className="flex items-center gap-6">
          <svg width={140} height={140} viewBox="0 0 140 140" className="shrink-0">
            {slices.map((s) => (
              <circle
                key={s.status}
                cx={cx} cy={cy} r={R}
                fill="none"
                stroke={STATUS_COLORS[s.status] || "#94a3b8"}
                strokeWidth={18}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={-s.offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
              />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize={20} fontWeight="700" fill="#111827">{total}</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="#6b7280">মোট</text>
          </svg>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {slices.map((s) => (
              <div key={s.status} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[s.status] || "#94a3b8" }} />
                <span className="text-xs text-gray-600 truncate">{STATUS_LABELS[s.status] || s.status}</span>
                <span className="ml-auto text-xs font-semibold text-gray-800">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
