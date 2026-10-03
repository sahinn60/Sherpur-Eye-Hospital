"use client";

interface BarChartProps {
  data: { date: string; count: number }[];
  title: string;
}

export function AppointmentBarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const W = 480;
  const H = 160;
  const PAD = { top: 16, right: 8, bottom: 32, left: 28 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = Math.floor(chartW / Math.max(data.length, 1)) - 6;

  function dayLabel(iso: string) {
    const d = new Date(iso);
    return ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"][d.getDay()];
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">কোনো ডেটা নেই</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
          {/* Y gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PAD.top + chartH * (1 - t);
            return (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} />
                <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                  {Math.round(max * t)}
                </text>
              </g>
            );
          })}
          {/* Bars */}
          {data.map((d, i) => {
            const barH = Math.max((d.count / max) * chartH, d.count > 0 ? 4 : 0);
            const x = PAD.left + i * (chartW / data.length) + (chartW / data.length - barW) / 2;
            const y = PAD.top + chartH - barH;
            return (
              <g key={d.date}>
                <rect x={x} y={y} width={barW} height={barH} rx={3} fill="#2563eb" opacity={0.85} />
                <text x={x + barW / 2} y={H - PAD.bottom + 14} textAnchor="middle" fontSize={9} fill="#6b7280">
                  {dayLabel(d.date)}
                </text>
                {d.count > 0 && (
                  <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#2563eb" fontWeight="600">
                    {d.count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
