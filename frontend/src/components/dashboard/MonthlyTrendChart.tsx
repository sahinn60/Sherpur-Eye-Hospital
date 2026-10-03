"use client";

interface LineChartProps {
  data: { month: string; count: number }[];
  title: string;
}

const MONTH_LABELS: Record<string, string> = {
  "01": "জান", "02": "ফেব", "03": "মার", "04": "এপ্র",
  "05": "মে",  "06": "জুন", "07": "জুল", "08": "আগ",
  "09": "সেপ", "10": "অক্ট","11": "নভ", "12": "ডিস",
};

export function MonthlyTrendChart({ data, title }: LineChartProps) {
  const W = 480;
  const H = 160;
  const PAD = { top: 20, right: 16, bottom: 32, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const max = Math.max(...data.map((d) => d.count), 1);

  function px(i: number) {
    return PAD.left + (i / Math.max(data.length - 1, 1)) * chartW;
  }
  function py(v: number) {
    return PAD.top + chartH - (v / max) * chartH;
  }

  const points = data.map((d, i) => `${px(i)},${py(d.count)}`).join(" ");
  const areaPoints = data.length > 0
    ? `${px(0)},${PAD.top + chartH} ${points} ${px(data.length - 1)},${PAD.top + chartH}`
    : "";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">কোনো ডেটা নেই</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
          {[0, 0.5, 1].map((t) => {
            const y = PAD.top + chartH * (1 - t);
            return (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#f3f4f6" strokeWidth={1} />
                <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                  {Math.round(max * t)}
                </text>
              </g>
            );
          })}
          {areaPoints && (
            <polygon points={areaPoints} fill="#3b82f6" opacity={0.08} />
          )}
          {data.length > 1 && (
            <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" />
          )}
          {data.map((d, i) => (
            <g key={d.month}>
              <circle cx={px(i)} cy={py(d.count)} r={4} fill="#3b82f6" stroke="white" strokeWidth={2} />
              <text x={px(i)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize={9} fill="#6b7280">
                {MONTH_LABELS[d.month.split("-")[1]] || d.month}
              </text>
              {d.count > 0 && (
                <text x={px(i)} y={py(d.count) - 8} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight="600">
                  {d.count}
                </text>
              )}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
