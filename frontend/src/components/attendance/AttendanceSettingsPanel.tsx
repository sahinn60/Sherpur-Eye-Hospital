"use client";

import { useState, useEffect } from "react";
import { Save, Clock, Calendar, AlertTriangle } from "lucide-react";
import { fetchSettings, saveSettings } from "@/lib/services/attendanceService";
import { AttendanceSettings } from "@/types/attendance";
import { Button } from "@/components/ui";

const ALL_DAYS = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"];
const DAY_BN: Record<string,string> = {
  Saturday:"শনিবার", Sunday:"রবিবার", Monday:"সোমবার",
  Tuesday:"মঙ্গলবার", Wednesday:"বুধবার", Thursday:"বৃহস্পতিবার", Friday:"শুক্রবার",
};

export function AttendanceSettingsPanel() {
  const [settings, setSettings] = useState<AttendanceSettings | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => { fetchSettings().then(setSettings).catch(() => {}); }, []);

  function toggleDay(day: string, field: "workingDays" | "weekends") {
    if (!settings) return;
    const current = settings[field];
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    setSettings({ ...settings, [field]: updated });
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true); setError(""); setSaved(false);
    try {
      const updated = await saveSettings(settings);
      setSettings(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally { setSaving(false); }
  }

  if (!settings) return (
    <div className="space-y-3">
      {[1,2,3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  const field = (label: string, value: string | number, onChange: (v: string) => void, type = "text") => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Office Hours */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-primary-600" />
          <h3 className="text-sm font-semibold text-gray-800">অফিস সময়</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {field("শুরুর সময়", settings.officeStartTime,
            (v) => setSettings({ ...settings, officeStartTime: v }), "time")}
          {field("শেষের সময়", settings.officeEndTime,
            (v) => setSettings({ ...settings, officeEndTime: v }), "time")}
          {field("গ্রেস পিরিয়ড (মিনিট)", settings.gracePeriodMinutes,
            (v) => setSettings({ ...settings, gracePeriodMinutes: parseInt(v) || 0 }), "number")}
          {field("লেট থ্রেশহোল্ড (মিনিট)", settings.lateThresholdMinutes,
            (v) => setSettings({ ...settings, lateThresholdMinutes: parseInt(v) || 0 }), "number")}
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {field("আর্লি চেকআউট থ্রেশহোল্ড (মিনিট)", settings.earlyCheckoutMinutes,
            (v) => setSettings({ ...settings, earlyCheckoutMinutes: parseInt(v) || 0 }), "number")}
        </div>
        <div className="mt-3 bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
          গ্রেস পিরিয়ড: অফিস শুরুর পরে এই সময়ের মধ্যে আসলে লেট হিসাব হবে না।
        </div>
      </div>

      {/* Working Days */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-primary-600" />
          <h3 className="text-sm font-semibold text-gray-800">কার্যদিবস</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => {
            const isWorking = settings.workingDays.includes(day);
            const isWeekend = settings.weekends.includes(day);
            return (
              <button key={day} type="button"
                onClick={() => {
                  if (isWorking) {
                    toggleDay(day, "workingDays");
                    if (!isWeekend) toggleDay(day, "weekends");
                  } else {
                    toggleDay(day, "workingDays");
                    setSettings((s) => s ? { ...s, weekends: s.weekends.filter((d) => d !== day) } : s);
                  }
                }}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  isWorking
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-gray-500 border-gray-300 hover:border-primary-400"
                }`}>
                {DAY_BN[day]}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">নীল = কার্যদিবস, সাদা = সাপ্তাহিক ছুটি</p>
      </div>

      {/* Weekend */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-500" />
          <h3 className="text-sm font-semibold text-gray-800">সাপ্তাহিক ছুটি</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_DAYS.map((day) => {
            const isWeekend = settings.weekends.includes(day);
            return (
              <button key={day} type="button"
                onClick={() => toggleDay(day, "weekends")}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  isWeekend
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-500 border-gray-300 hover:border-amber-400"
                }`}>
                {DAY_BN[day]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">✅ সেটিংস সংরক্ষিত হয়েছে</p>}
      <Button onClick={handleSave} loading={saving} className="flex items-center gap-2">
        <Save size={15} /> সেটিংস সংরক্ষণ করুন
      </Button>
    </div>
  );
}
