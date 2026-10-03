"use client";

import {
  Users, Stethoscope, UserRound, CalendarDays,
  Clock, UserCheck, UserX, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/types";
import { useDashboard } from "@/hooks/useDashboard";
import {
  StatCard,
  AppointmentBarChart,
  StatusDonutChart,
  MonthlyTrendChart,
  AttendanceSummary,
  RecentAppointments,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();

  const c = data?.cards;

  const statCards = [
    { label: "মোট রোগী",            value: c?.totalPatients ?? 0,      icon: UserRound,    color: "bg-blue-50 text-blue-600" },
    { label: "সক্রিয় চিকিৎসক",     value: c?.totalDoctors ?? 0,       icon: Stethoscope,  color: "bg-emerald-50 text-emerald-600" },
    { label: "মোট কর্মচারী",        value: c?.totalEmployees ?? 0,     icon: Users,        color: "bg-violet-50 text-violet-600" },
    { label: "আজকের অ্যাপয়েন্টমেন্ট", value: c?.todayAppointments ?? 0, icon: CalendarDays, color: "bg-amber-50 text-amber-600" },
    { label: "অপেক্ষমাণ",           value: c?.pendingAppointments ?? 0, icon: Clock,        color: "bg-orange-50 text-orange-600" },
    { label: "আজ উপস্থিত",          value: c?.presentToday ?? 0,       icon: UserCheck,    color: "bg-teal-50 text-teal-600" },
    { label: "আজ অনুপস্থিত",        value: c?.absentToday ?? 0,        icon: UserX,        color: "bg-red-50 text-red-600" },
    { label: "আজ দেরিতে",           value: c?.lateToday ?? 0,          icon: AlertCircle,  color: "bg-yellow-50 text-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          স্বাগতম, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {user?.role ? ROLE_LABELS[user.role]?.bn : ""} — শেরপুর আধুনিক চক্ষু হাসপাতাল
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে: {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            icon={s.icon}
            color={s.color}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AppointmentBarChart
            data={data?.weeklyAppointments ?? []}
            title="গত ৭ দিনের অ্যাপয়েন্টমেন্ট"
          />
        </div>
        <StatusDonutChart
          data={data?.statusBreakdown ?? []}
          title="অ্যাপয়েন্টমেন্ট অবস্থা"
        />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyTrendChart
            data={data?.monthlyTrend ?? []}
            title="মাসিক অ্যাপয়েন্টমেন্ট প্রবণতা (৬ মাস)"
          />
        </div>
        <AttendanceSummary
          present={c?.presentToday ?? 0}
          absent={c?.absentToday ?? 0}
          late={c?.lateToday ?? 0}
          loading={loading}
        />
      </div>

      {/* Recent Appointments */}
      <RecentAppointments
        data={data?.recentAppointments ?? []}
        loading={loading}
      />
    </div>
  );
}
