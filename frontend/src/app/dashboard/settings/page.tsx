"use client";

import { useState } from "react";
import { RouteGuard } from "@/components/auth";
import { Button } from "@/components/ui";
import { AttendanceSettingsPanel } from "@/components/attendance";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

type Tab = "password" | "attendance";

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>("password");

  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError("নতুন পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে।");
    } finally { setLoading(false); }
  }

  const TABS: { key: Tab; label: string; adminOnly?: boolean }[] = [
    { key: "password",   label: "পাসওয়ার্ড পরিবর্তন" },
    { key: "attendance", label: "উপস্থিতি সেটিংস", adminOnly: true },
  ];

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5 max-w-2xl">

        <div>
          <h1 className="text-xl font-bold text-gray-900">সেটিংস</h1>
          <p className="text-sm text-gray-500 mt-0.5">সিস্টেম কনফিগারেশন</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
          {TABS.filter((t) => !t.adminOnly || isAdmin).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Password Change */}
        {tab === "password" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">পাসওয়ার্ড পরিবর্তন করুন</h2>
            {error   && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-4">{error}</p>}
            {success && <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg mb-4">{success}</p>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">বর্তমান পাসওয়ার্ড *</label>
                <input type="password" value={form.currentPassword}
                  onChange={(e) => set("currentPassword", e.target.value)} required className={inp} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">নতুন পাসওয়ার্ড *</label>
                <input type="password" value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)} required minLength={8} className={inp} />
                <p className="text-xs text-gray-400 mt-1">কমপক্ষে ৮ অক্ষর</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                <input type="password" value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)} required minLength={8} className={inp} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Attendance Settings */}
        {tab === "attendance" && isAdmin && <AttendanceSettingsPanel />}
      </div>
    </RouteGuard>
  );
}
