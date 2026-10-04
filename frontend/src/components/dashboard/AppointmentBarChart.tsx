"use client";

interface BarChartProps {
  data: { date: string; count: number }[];
  title: string;
}

export function AppointmentBarChart({ data, title }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const W = 480; const H = 180;
  const PAD = { top: 20, right: 12, bottom: 36, left: 32 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const barW = Math.floor(chartW / Math.max(data.length, 1)) - 8;

  function dayLabel(iso: string) {
    const d = new Date(iso);
    return ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"][d.getDay()];
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>দৈনিক অ্যাপয়েন্টমেন্ট সংখ্যা</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: "#eff6ff", color: "#2563eb" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#3b82f6" }} />
          অ্যাপয়েন্টমেন্ট
        </div>
      </div>
      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: 160, color: "#94a3b8", fontSize: 14 }}>
          কোনো ডেটা নেই
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = PAD.top + chartH * (1 - t);
            return (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
                  stroke={t === 0 ? "#e2e8f0" : "#f1f5f9"} strokeWidth={1} />
                <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#94a3b8">
                  {Math.round(max * t)}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const barH = Math.max((d.count / max) * chartH, d.count > 0 ? 6 : 0);
            const x = PAD.left + i * (chartW / data.length) + (chartW / data.length - barW) / 2;
            const y = PAD.top + chartH - barH;
            return (
              <g key={d.date}>
                <rect x={x} y={PAD.top + chartH} width={barW} height={0} rx={4} fill="url(#barGrad)" opacity={0}>
                  <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" />
                  <animate attributeName="y" from={PAD.top + chartH} to={y} dur="0.6s" fill="freeze" />
                  <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
                </rect>
                <text x={x + barW / 2} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={9} fill="#64748b">
                  {dayLabel(d.date)}
                </text>
                {d.count > 0 && (
                  <text x={x + barW / 2} y={y - 5} textAnchor="middle" fontSize={9} fill="#2563eb" fontWeight="700">
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
