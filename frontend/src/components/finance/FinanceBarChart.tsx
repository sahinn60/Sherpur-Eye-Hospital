"use client";

interface Bar { label: string; income: number; expense: number; }

interface Props { data: Bar[]; height?: number; }

export function FinanceBarChart({ data, height = 200 }: Props) {
  if (!data.length) return <div className="h-48 flex items-center justify-center text-gray-300 text-sm">কোনো ডেটা নেই</div>;

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const barW   = Math.max(8, Math.floor(560 / data.length / 2) - 2);
  const gap    = Math.max(4, Math.floor(560 / data.length) - barW * 2 - 2);
  const groupW = barW * 2 + gap + 4;
  const svgW   = data.length * groupW + 40;

  return (
    <div className="overflow-x-auto">
      <svg width={svgW} height={height + 40} className="min-w-full">
        {/* Y grid lines */}
        {[0,0.25,0.5,0.75,1].map((f) => {
          const y = 10 + (1 - f) * height;
          return (
            <g key={f}>
              <line x1={30} y1={y} x2={svgW - 4} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <text x={28} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
                {f === 0 ? "0" : `${Math.round(maxVal * f / 1000)}k`}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => {
          const x      = 34 + i * groupW;
          const incH   = (d.income  / maxVal) * height;
          const expH   = (d.expense / maxVal) * height;
          const incY   = 10 + height - incH;
          const expY   = 10 + height - expH;
          return (
            <g key={i}>
              {/* Income bar */}
              <rect x={x} y={incY} width={barW} height={incH} fill="#10b981" rx={2}>
                <title>আয়: ৳{d.income.toFixed(0)}</title>
              </rect>
              {/* Expense bar */}
              <rect x={x + barW + 2} y={expY} width={barW} height={expH} fill="#ef4444" rx={2}>
                <title>ব্যয়: ৳{d.expense.toFixed(0)}</title>
              </rect>
              {/* Label */}
              <text x={x + barW} y={height + 24} textAnchor="middle" fontSize={9} fill="#6b7280">
                {d.label.length > 6 ? d.label.slice(0, 5) + "…" : d.label}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x={svgW - 90} y={4} width={10} height={10} fill="#10b981" rx={2} />
        <text x={svgW - 77} y={13} fontSize={9} fill="#374151">আয়</text>
        <rect x={svgW - 50} y={4} width={10} height={10} fill="#ef4444" rx={2} />
        <text x={svgW - 37} y={13} fontSize={9} fill="#374151">ব্যয়</text>
      </svg>
    </div>
  );
}
