"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Stethoscope, Users, CalendarCheck, CalendarOff,
  UserRound, CalendarDays, FileText, Receipt, TrendingUp, TrendingDown,
  Package, Scissors, BarChart2, Newspaper, Image, ShieldCheck, Settings,
  Menu, X, LogOut, ChevronRight, Globe, ClipboardList,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { ROLE_LABELS, STAFF_ROLES, UserRole, ADMIN_ROLES } from "@/types";
import { SIDEBAR_NAV } from "@/lib/sidebarNav";
import { NotificationBell } from "@/components/leave";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Stethoscope, Users, CalendarCheck, CalendarOff,
  UserRound, CalendarDays, FileText, Receipt, TrendingUp, TrendingDown,
  Package, Scissors, BarChart2, Newspaper, Image, ShieldCheck, Settings, Globe, ClipboardList,
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

  return (
    <RouteGuard allowedRoles={STAFF_ROLES}>
      <div className="min-h-screen bg-gray-50 flex">

        {/* Mobile overlay */}
        {open && (
          <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <aside className={`
          fixed top-0 left-0 h-full w-60 bg-gray-900 text-white z-30 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto
        `}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-700 shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-lg shrink-0">👁️</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight truncate">শেরপুর চক্ষু হাসপাতাল</p>
              <p className="text-[10px] text-gray-400">Management Portal</p>
            </div>
            <button className="ml-auto lg:hidden text-gray-400 hover:text-white" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            {SIDEBAR_NAV.map((group) => {
              const visible = group.items.filter((item) =>
                canSeeItem(item, userRole, hasPermission, isAdmin)
              );
              if (!visible.length) return null;
              return (
                <div key={group.group}>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                    {group.group}
                  </p>
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
                        className={`
                          flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all mb-0.5
                          ${isActive
                            ? "bg-primary-600 text-white shadow-sm"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                          }
                        `}
                      >
                        {Icon && <Icon size={16} className="shrink-0" />}
                        <span className="truncate">{item.label}</span>
                        {isActive && <ChevronRight size={14} className="ml-auto shrink-0 opacity-70" />}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          {/* User footer */}
          <div className="px-3 py-3 border-t border-gray-700 shrink-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400">{user?.role ? ROLE_LABELS[user.role]?.bn : ""}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-400 transition-colors w-full px-1 py-1 rounded"
            >
              <LogOut size={13} />
              লগআউট করুন
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3 sticky top-0 z-10 shrink-0">
            <button
              className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex-1" />
            <NotificationBell />
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-600">{user?.name}</span>
              <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-primary-100">
                {user?.role ? ROLE_LABELS[user.role]?.en : ""}
              </span>
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
