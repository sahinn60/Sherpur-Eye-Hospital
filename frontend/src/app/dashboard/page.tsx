"use client";

import {
  Users, Stethoscope, UserRound, CalendarDays,
  Clock, UserCheck, UserX, AlertCircle, ArrowUpRight, Activity,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import {
  AppointmentBarChart,
  StatusDonutChart,
  MonthlyTrendChart,
  AttendanceSummary,
  RecentAppointments,
} from "@/components/dashboard";

const STAT_CARDS = [
  { key: "totalPatients",       label: "মোট রোগী",              icon: UserRound,    gradient: "linear-gradient(135deg,#3b82f6,#1d4ed8)", light: "#eff6ff", text: "#1d4ed8" },
  { key: "totalDoctors",        label: "সক্রিয় চিকিৎসক",       icon: Stethoscope,  gradient: "linear-gradient(135deg,#10b981,#059669)", light: "#ecfdf5", text: "#059669" },
  { key: "totalEmployees",      label: "মোট কর্মচারী",          icon: Users,        gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9)", light: "#f5f3ff", text: "#6d28d9" },
  { key: "todayAppointments",   label: "আজকের অ্যাপয়েন্টমেন্ট", icon: CalendarDays, gradient: "linear-gradient(135deg,#f59e0b,#d97706)", light: "#fffbeb", text: "#d97706" },
  { key: "pendingAppointments", label: "অপেক্ষমাণ",              icon: Clock,        gradient: "linear-gradient(135deg,#f97316,#ea580c)", light: "#fff7ed", text: "#ea580c" },
  { key: "presentToday",        label: "আজ উপস্থিত",            icon: UserCheck,    gradient: "linear-gradient(135deg,#14b8a6,#0d9488)", light: "#f0fdfa", text: "#0d9488" },
  { key: "absentToday",         label: "আজ অনুপস্থিত",          icon: UserX,        gradient: "linear-gradient(135deg,#ef4444,#dc2626)", light: "#fef2f2", text: "#dc2626" },
  { key: "lateToday",           label: "আজ দেরিতে",             icon: AlertCircle,  gradient: "linear-gradient(135deg,#eab308,#ca8a04)", light: "#fefce8", text: "#ca8a04" },
];

function StatCard({ label, value, icon: Icon, gradient, light, text, loading }: {
  label: string; value: number; icon: React.ElementType;
  gradient: string; light: string; text: string; loading: boolean;
}) {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5"
      style={{ background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: gradient }}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        {loading ? (
          <div className="h-7 w-14 rounded-lg animate-pulse mb-1" style={{ background: "#f1f5f9" }} />
        ) : (
          <p className="text-2xl font-bold leading-tight" style={{ color: "#0f172a" }}>{value}</p>
        )}
        <p className="text-xs font-medium truncate mt-0.5" style={{ color: "#64748b" }}>{label}</p>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: light }}>
        <ArrowUpRight size={14} style={{ color: text }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();
  const c = data?.cards;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "শুভ সকাল" : hour < 17 ? "শুভ বিকাল" : "শুভ সন্ধ্যা";

  return (
    <div className="space-y-6 max-w-screen-xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
            {greeting}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {user?.role ? ROLE_LABELS[user.role]?.bn : ""} — শেরপুর আধুনিক চক্ষু হাসপাতাল
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: "white", border: "1px solid #e2e8f0", color: "#475569",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <Activity size={14} className="text-green-500" />
          {now.toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
          ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে: {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={(c as any)?.[s.key] ?? 0}
            icon={s.icon}
            gradient={s.gradient}
            light={s.light}
            text={s.text}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AppointmentBarChart data={data?.weeklyAppointments ?? []} title="গত ৭ দিনের অ্যাপয়েন্টমেন্ট" />
        </div>
        <StatusDonutChart data={data?.statusBreakdown ?? []} title="অ্যাপয়েন্টমেন্ট অবস্থা" />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyTrendChart data={data?.monthlyTrend ?? []} title="মাসিক অ্যাপয়েন্টমেন্ট প্রবণতা (৬ মাস)" />
        </div>
        <AttendanceSummary
          present={c?.presentToday ?? 0}
          absent={c?.absentToday ?? 0}
          late={c?.lateToday ?? 0}
          loading={loading}
        />
      </div>

      {/* Recent Appointments */}
      <RecentAppointments data={data?.recentAppointments ?? []} loading={loading} />
    </div>
  );
}
