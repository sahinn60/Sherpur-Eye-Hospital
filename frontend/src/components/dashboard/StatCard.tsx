import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
}

export function StatCard({ label, value, icon: Icon, color, loading }: StatCardProps) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5"
      style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        {loading ? (
          <div className="h-7 w-14 rounded-lg animate-pulse mb-1" style={{ background: "#f1f5f9" }} />
        ) : (
          <p className="text-2xl font-bold leading-tight" style={{ color: "#0f172a" }}>{value}</p>
        )}
        <p className="text-xs font-medium truncate mt-0.5" style={{ color: "#64748b" }}>{label}</p>
      </div>
    </div>
  );
}
