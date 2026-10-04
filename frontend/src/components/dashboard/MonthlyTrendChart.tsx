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
  const W = 480; const H = 180;
  const PAD = { top: 24, right: 16, bottom: 36, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const max = Math.max(...data.map((d) => d.count), 1);

  const px = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * chartW;
  const py = (v: number) => PAD.top + chartH - (v / max) * chartH;

  const points = data.map((d, i) => `${px(i)},${py(d.count)}`).join(" ");
  const areaPoints = data.length > 0
    ? `${px(0)},${PAD.top + chartH} ${points} ${px(data.length - 1)},${PAD.top + chartH}`
    : "";

  // smooth curve path
  function smoothPath() {
    if (data.length < 2) return "";
    let d = `M ${px(0)} ${py(data[0].count)}`;
    for (let i = 1; i < data.length; i++) {
      const x0 = px(i - 1), y0 = py(data[i - 1].count);
      const x1 = px(i), y1 = py(data[i].count);
      const cpx = (x0 + x1) / 2;
      d += ` C ${cpx} ${y0}, ${cpx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  }

  const linePath = smoothPath();
  const areaPath = linePath
    ? `${linePath} L ${px(data.length - 1)} ${PAD.top + chartH} L ${px(0)} ${PAD.top + chartH} Z`
    : "";

  return (
    <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>মাসিক প্রবণতা বিশ্লেষণ</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: "#f0fdf4", color: "#16a34a" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          ট্রেন্ড
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center" style={{ height: 160, color: "#94a3b8", fontSize: 14 }}>
          কোনো ডেটা নেই
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
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

          {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}
          {linePath && <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />}

          {data.map((d, i) => (
            <g key={d.month}>
              <circle cx={px(i)} cy={py(d.count)} r={5} fill="white" stroke="#3b82f6" strokeWidth={2.5} />
              <text x={px(i)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={9} fill="#64748b">
                {MONTH_LABELS[d.month.split("-")[1]] || d.month}
              </text>
              {d.count > 0 && (
                <text x={px(i)} y={py(d.count) - 9} textAnchor="middle" fontSize={9} fill="#2563eb" fontWeight="700">
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
