"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import {
  CameraCapture, AttendanceCard, AttendanceHistory,
  AdminAttendanceView, AttendanceSettingsPanel, AttendanceReports,
} from "@/components/attendance";
import { checkIn, checkOut, fetchTodayAttendance } from "@/lib/services/attendanceService";
import { AttendanceRecord } from "@/types/attendance";

type Flow = "idle" | "camera-checkin" | "camera-checkout";
type Tab  = "self" | "admin" | "reports" | "settings";

export default function AttendancePage() {
  const { user, isAdmin, hasRole } = useAuth();
  const isManager = isAdmin || hasRole("HR");

  const [record,  setRecord]  = useState<AttendanceRecord | null>(null);
  const [flow,    setFlow]    = useState<Flow>("idle");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [tab,     setTab]     = useState<Tab>("self");

  const loadToday = useCallback(async () => {
    try { setRecord(await fetchTodayAttendance()); }
    catch { /* no record yet */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadToday(); }, [loadToday]);

  function getLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        ()    => resolve(null),
        { timeout: 5000 },
      );
    });
  }

  async function handleCapture(selfie: string) {
    const capturedFlow = flow;
    setFlow("idle");
    setError(""); setSuccess(""); setLoading(true);
    const location = await getLocation();
    try {
      const payload = { selfie, latitude: location?.latitude, longitude: location?.longitude };
      let updated: AttendanceRecord;
      if (capturedFlow === "camera-checkin") {
        updated = await checkIn(payload);
        setSuccess("✅ চেক-ইন সফল হয়েছে!");
      } else {
        updated = await checkOut(payload);
        setSuccess("✅ চেক-আউট সফল হয়েছে!");
      }
      setRecord(updated);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally { setLoading(false); }
  }

  async function handleSkipSelfie(type: "checkin" | "checkout") {
    setError(""); setSuccess(""); setLoading(true);
    const location = await getLocation();
    try {
      const payload = { latitude: location?.latitude, longitude: location?.longitude };
      let updated: AttendanceRecord;
      if (type === "checkin") {
        updated = await checkIn(payload);
        setSuccess("✅ চেক-ইন সফল হয়েছে!");
      } else {
        updated = await checkOut(payload);
        setSuccess("✅ চেক-আউট সফল হয়েছে!");
      }
      setRecord(updated);
    } catch (e: any) {
      setError(e?.response?.data?.message || "সমস্যা হয়েছে।");
    } finally { setLoading(false); }
  }

  function startCheckIn() {
    setError(""); setSuccess("");
    if (typeof navigator !== "undefined" && "mediaDevices" in navigator && navigator.mediaDevices !== null) {
      setFlow("camera-checkin");
    } else {
      handleSkipSelfie("checkin");
    }
  }

  function startCheckOut() {
    setError(""); setSuccess("");
    if (typeof navigator !== "undefined" && "mediaDevices" in navigator && navigator.mediaDevices !== null) {
      setFlow("camera-checkout");
    } else {
      handleSkipSelfie("checkout");
    }
  }

  if (flow !== "idle") {
    return <CameraCapture onCapture={handleCapture} onCancel={() => setFlow("idle")} />;
  }

  const TABS: { key: Tab; label: string; adminOnly?: boolean }[] = [
    { key: "self",     label: "আমার উপস্থিতি" },
    { key: "admin",    label: "সবার উপস্থিতি", adminOnly: true },
    { key: "reports",  label: "রিপোর্ট",        adminOnly: true },
    { key: "settings", label: "সেটিংস",         adminOnly: true },
  ];

  const visibleTabs = TABS.filter((t) => !t.adminOnly || isManager);

  return (
    <RouteGuard>
      <div className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">উপস্থিতি ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">স্বাগতম, {user?.name}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit flex-wrap">
          {visibleTabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {error   && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">{success}</div>}

        {/* ── Self tab ── */}
        {tab === "self" && (
          <div className="max-w-lg space-y-4">
            {loading
              ? <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
              : <AttendanceCard record={record} onCheckIn={startCheckIn} onCheckOut={startCheckOut} loading={loading} />
            }
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 space-y-1">
              <p>📷 চেক-ইন/আউটে সেলফি তোলা হবে।</p>
              <p>📍 লোকেশন অনুমতি দিলে অবস্থান সংরক্ষিত হবে।</p>
              <p>🕐 সার্ভার সময় ব্যবহার করা হয় — ডিভাইসের সময় গ্রহণযোগ্য নয়।</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">উপস্থিতির ইতিহাস</h2>
              <AttendanceHistory />
            </div>
          </div>
        )}

        {/* ── Admin list tab ── */}
        {tab === "admin" && isManager && <AdminAttendanceView />}

        {/* ── Reports tab ── */}
        {tab === "reports" && isManager && <AttendanceReports />}

        {/* ── Settings tab ── */}
        {tab === "settings" && isAdmin && (
          <div className="max-w-2xl">
            <AttendanceSettingsPanel />
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
