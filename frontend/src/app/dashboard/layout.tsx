"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Stethoscope, Users, CalendarCheck, CalendarOff,
  UserRound, CalendarDays, FileText, Receipt, TrendingUp, TrendingDown,
  Package, Scissors, BarChart2, Newspaper, Image, ShieldCheck, Settings,
  Menu, X, LogOut, Globe, ClipboardList, ChevronDown, Bell, BookTemplate,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { ROLE_LABELS, STAFF_ROLES, UserRole } from "@/types";
import { SIDEBAR_NAV } from "@/lib/sidebarNav";
import { NotificationBell } from "@/components/leave";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Stethoscope, Users, CalendarCheck, CalendarOff,
  UserRound, CalendarDays, FileText, Receipt, TrendingUp, TrendingDown,
  Package, Scissors, BarChart2, Newspaper, Image, ShieldCheck, Settings, Globe, ClipboardList, BookTemplate,
};

function canSeeItem(
  item: { roles?: UserRole[]; permission?: string },
  userRole: UserRole,
  hasPermission: (k: string) => boolean,
  isAdmin: boolean
) {
  if (item.roles && !item.roles.includes(userRole)) return false;
  if (item.permission && !isAdmin && !hasPermission(item.permission)) return false;
  return true;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, hasPermission, isAdmin } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const userRole = user?.role as UserRole;
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <RouteGuard allowedRoles={STAFF_ROLES}>
      <div className="min-h-screen flex" style={{ background: "#f0f2f5" }}>

        {/* Mobile overlay */}
        {open && (
          <div
            className="fixed inset-0 z-20 lg:hidden"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
            onClick={() => setOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`
          fixed top-0 left-0 h-full z-30 flex flex-col no-print
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
        `} style={{ width: 256, background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>

          {/* Logo area */}
          <div className="flex items-center gap-3 px-5 shrink-0" style={{ height: 64, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-center rounded-xl shrink-0 text-xl"
              style={{ width: 38, height: 38, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
              👁️
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white leading-tight truncate">শেরপুর চক্ষু হাসপাতাল</p>
              <p className="text-[10px] font-medium" style={{ color: "#64748b" }}>Admin Portal</p>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ scrollbarWidth: "none" }}>
            {SIDEBAR_NAV.map((group) => {
              const visible = group.items.filter((item) =>
                canSeeItem(item, userRole, hasPermission, isAdmin)
              );
              if (!visible.length) return null;
              return (
                <div key={group.group} className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
                    style={{ color: "#475569", letterSpacing: "0.1em" }}>
                    {group.group}
                  </p>
                  <div className="space-y-0.5">
                    {visible.map((item) => {
                      const Icon = ICON_MAP[item.icon];
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative"
                          style={isActive ? {
                            background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))",
                            color: "#60a5fa",
                          } : {
                            color: "#94a3b8",
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                              (e.currentTarget as HTMLElement).style.color = "#e2e8f0";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                              (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                            }
                          }}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                              style={{ background: "#3b82f6" }} />
                          )}
                          {Icon && <Icon size={15} className="shrink-0" />}
                          <span className="truncate">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User footer */}
          <div className="px-3 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-2"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px]" style={{ color: "#64748b" }}>
                  {user?.role ? ROLE_LABELS[user.role]?.bn : ""}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{ color: "#64748b" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#f87171";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#64748b";
              }}
            >
              <LogOut size={13} />
              লগআউট করুন
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Topbar */}
          <header className="sticky top-0 z-10 shrink-0 flex items-center gap-4 px-5 no-print"
            style={{
              height: 64,
              background: "rgba(240,242,245,0.9)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}>
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
              style={{ background: "white", border: "1px solid #e2e8f0" }}
              onClick={() => setOpen(true)}
            >
              <Menu size={18} className="text-gray-600" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">Admin</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-700 font-medium capitalize">
                {pathname.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") || "Dashboard"}
              </span>
            </div>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <NotificationBell />

              {/* User chip */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-default"
                style={{ background: "white", border: "1px solid #e2e8f0" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  {initials}
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name?.split(" ")[0]}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#eff6ff", color: "#2563eb" }}>
                  {user?.role ? ROLE_LABELS[user.role]?.en : ""}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-5 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
