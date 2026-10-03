"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  fetchUnreadCount, fetchNotifications,
  markNotificationRead, markAllNotificationsRead,
} from "@/lib/services/leaveService";
import { Notification } from "@/types/leave";

const TYPE_CONFIG: Record<string, { icon: string; bg: string }> = {
  LEAVE_APPLIED:          { icon: "📋", bg: "bg-amber-50" },
  LEAVE_APPROVED:         { icon: "✅", bg: "bg-green-50" },
  LEAVE_REJECTED:         { icon: "❌", bg: "bg-red-50" },
  LEAVE_CANCELLED:        { icon: "🚫", bg: "bg-gray-50" },
  APPOINTMENT_NEW:        { icon: "📅", bg: "bg-blue-50" },
  APPOINTMENT_CONFIRMED:  { icon: "✔️", bg: "bg-green-50" },
  APPOINTMENT_CANCELLED:  { icon: "🗓️", bg: "bg-red-50" },
  ATTENDANCE_LATE:        { icon: "⏰", bg: "bg-amber-50" },
  ATTENDANCE_ABSENT:      { icon: "🔴", bg: "bg-red-50" },
  HOSPITAL_NOTICE:        { icon: "📢", bg: "bg-primary-50" },
  SYSTEM:                 { icon: "⚙️", bg: "bg-gray-50" },
  GENERAL:                { icon: "🔔", bg: "bg-gray-50" },
};

export function NotificationBell() {
  const [open,    setOpen]    = useState(false);
  const [unread,  setUnread]  = useState(0);
  const [items,   setItems]   = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadCount = useCallback(async () => {
    try { setUnread(await fetchUnreadCount()); } catch {}
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications(1, 20);
      setItems(res.items);
      setUnread(res.unreadCount);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [loadCount]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle() {
    if (!open) loadNotifications();
    setOpen((o) => !o);
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    setUnread((c) => Math.max(0, c - 1));
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button onClick={toggle}
        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">নোটিফিকেশন</h3>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700">
                <CheckCheck size={13} /> সব পড়া হয়েছে
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">কোনো নোটিফিকেশন নেই</p>
              </div>
            ) : (
              items.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.GENERAL;
                return (
                  <button key={n.id}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.isRead ? cfg.bg : ""}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base shrink-0 mt-0.5">{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${n.isRead ? "text-gray-600" : "text-gray-900"}`}>
                          {n.titleBn}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.bodyBn}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString("bn-BD", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 text-center">
              <p className="text-xs text-gray-400">মোট {items.length}টি নোটিফিকেশন দেখানো হচ্ছে</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
