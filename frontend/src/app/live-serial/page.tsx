"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, List } from "lucide-react";
import { useLang } from "@/context/LangContext";

const API = process.env.NEXT_PUBLIC_API_URL || "https://sherpur-eye-hospital.onrender.com/api/v1";
const POLL_MS = 8000;
const STALE_MS = 30000;

interface Doctor  { id: string; nameBn: string; nameEn: string; }
interface Session { id: string; roomLabel: string; status: string; }
interface SerialData {
  sessionId: string; doctorNameBn: string; roomLabel: string;
  status: string;
  currentToken:   string | null;
  nextToken:      string | null;
  afterNextToken: string | null;
  updatedAt: string;
}

const STATUS_LABEL: Record<string, { bn: string; color: string; bg: string; border: string }> = {
  NOT_STARTED: { bn: "শুরু হয়নি",  color: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200" },
  RUNNING:     { bn: "চলছে",        color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  PAUSED:      { bn: "বিরতি",       color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  FINISHED:    { bn: "শেষ হয়েছে", color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
};

function dhakaTime(d: Date) {
  return d.toLocaleTimeString("bn-BD", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function dhakaTimeEn(d: Date) {
  return d.toLocaleTimeString("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function LiveSerialPage() {
  const { t } = useLang();

  const [doctors,       setDoctors]       = useState<Doctor[]>([]);
  const [sessions,      setSessions]      = useState<Session[]>([]);
  const [serial,        setSerial]        = useState<SerialData | null>(null);
  const [selDoctor,     setSelDoctor]     = useState("");
  const [selSession,    setSelSession]    = useState("");
  const [stale,         setStale]         = useState(false);
  const [lastUpdate,    setLastUpdate]    = useState<Date | null>(null);
  const [doctorsLoaded, setDoctorsLoaded] = useState(false);
  const [fetchError,    setFetchError]    = useState(false);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const staleRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const fetchingRef = useRef(false);

  // Load doctors once
  useEffect(() => {
    fetch(`${API}/queue/public/doctors`)
      .then(r => r.json())
      .then(d => {
        setDoctorsLoaded(true);
        if (d.data?.length) { setDoctors(d.data); setSelDoctor(d.data[0].id); }
      })
      .catch(() => { setDoctorsLoaded(true); setFetchError(true); });
  }, []);

  // Load sessions when doctor changes
  useEffect(() => {
    if (!selDoctor) return;
    setSessions([]); setSelSession(""); setSerial(null);
    fetch(`${API}/queue/public/doctors/${selDoctor}/sessions`)
      .then(r => r.json())
      .then(d => { if (d.data?.length) { setSessions(d.data); setSelSession(d.data[0].id); } })
      .catch(() => {});
  }, [selDoctor]);

  // Poll serial
  const fetchSerial = useCallback(async () => {
    if (!selSession || fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const r = await fetch(`${API}/queue/public/sessions/${selSession}/serial`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setSerial(d.data);
      setLastUpdate(new Date());
      setStale(false);
      setFetchError(false);
      // reset stale timer
      if (staleRef.current) clearTimeout(staleRef.current);
      staleRef.current = setTimeout(() => setStale(true), STALE_MS);
    } catch {
      setStale(true);
      setFetchError(true);
    } finally {
      fetchingRef.current = false;
    }
  }, [selSession]);

  useEffect(() => {
    if (!selSession) { setSerial(null); return; }
    fetchSerial();
    timerRef.current = setInterval(fetchSerial, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (staleRef.current) clearTimeout(staleRef.current);
    };
  }, [selSession, fetchSerial]);

  const statusInfo = serial ? (STATUS_LABEL[serial.status] ?? { bn: serial.status, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" }) : null;

  const selCls = "w-full text-sm border border-blue-100 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700";

  function renderBody() {
    if (!doctorsLoaded) {
      return (
        <div className="flex items-center justify-center py-14 text-gray-400 text-sm gap-2">
          <RefreshCw size={14} className="animate-spin" />
          {t("লোড হচ্ছে...", "Loading...")}
        </div>
      );
    }
    if (fetchError && doctors.length === 0) {
      return (
        <div className="text-center py-14 space-y-2">
          <p className="text-red-500 text-sm font-medium">{t("সংযোগ ব্যর্থ হয়েছে", "Connection failed")}</p>
          <p className="text-gray-400 text-xs">{t("পুনরায় চেষ্টা করুন", "Please try again")}</p>
        </div>
      );
    }
    if (doctors.length === 0) {
      return (
        <div className="text-center py-14 space-y-2">
          <p className="text-gray-500 text-sm font-medium">{t("আজ কোনো সেশন চালু নেই", "No active session today")}</p>
          <p className="text-gray-400 text-xs">{t("ডাক্তার চেম্বার শুরু হলে এখানে লাইভ সিরিয়াল দেখাবে", "Live serial will appear when a doctor starts a session")}</p>
        </div>
      );
    }

    return (
      <>
        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("চিকিৎসক", "Doctor")}</label>
            <select className={selCls} value={selDoctor} onChange={e => setSelDoctor(e.target.value)}>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("চেম্বার / সেশন", "Chamber / Session")}</label>
            <select className={selCls} value={selSession} onChange={e => setSelSession(e.target.value)}>
              {sessions.length === 0
                ? <option value="">{t("আজ কোনো সেশন নেই", "No session today")}</option>
                : sessions.map(s => <option key={s.id} value={s.id}>{s.roomLabel}</option>)
              }
            </select>
          </div>
        </div>

        {/* Status badge */}
        {statusInfo && (
          <div className="flex items-center gap-2 mb-5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}>
              {t(statusInfo.bn, serial?.status ?? "")}
            </span>
            {stale && (
              <span className="text-xs text-orange-500 font-medium">
                {t("⚠ সংযোগ বিলম্বিত", "⚠ Connection delayed")}
              </span>
            )}
          </div>
        )}

        {/* Serial cards */}
        {!selSession || !serial ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            {selSession
              ? <><RefreshCw size={14} className="animate-spin inline mr-1" />{t("লোড হচ্ছে...", "Loading...")}</>
              : t("একটি সেশন নির্বাচন করুন", "Select a session")}
          </div>
        ) : serial.status === "NOT_STARTED" ? (
          <div className="text-center py-10 text-gray-400 text-sm">{t("সেশন এখনো শুরু হয়নি", "Session not started yet")}</div>
        ) : serial.status === "FINISHED" ? (
          <div className="text-center py-10 text-gray-400 text-sm">{t("আজকের সেশন শেষ হয়েছে", "Today's session has ended")}</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {[
              { labelBn: "বর্তমান সিরিয়াল", token: serial.currentToken,   accent: "green" },
              { labelBn: "পরবর্তী সিরিয়াল",  token: serial.nextToken,      accent: "blue"  },
              { labelBn: "তার পরের সিরিয়াল", token: serial.afterNextToken, accent: "gray"  },
            ].map(card => (
              <div key={card.labelBn} className="bg-white rounded-2xl p-4 text-center border border-blue-50 shadow-sm">
                <p className="text-xs text-gray-400 mb-2 leading-tight">{t(card.labelBn, card.labelBn)}</p>
                <p className={`text-3xl font-extrabold ${
                  card.accent === "green" ? "text-green-600" :
                  card.accent === "blue"  ? "text-blue-600"  : "text-gray-400"
                }`}>
                  {card.token ?? "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start px-4 py-10 sm:py-16">

      {/* Page heading */}
      <div className="w-full max-w-2xl mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <List size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 leading-none">{t("লাইভ সিরিয়াল", "Live Serial")}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{t("শেরপুর আধুনিক চক্ষু হাসপাতাল", "Sherpur Eye Hospital")}</p>
        </div>
      </div>

      {/* Panel — matches Image 2 */}
      <div className="w-full max-w-2xl bg-[#F0F6FF] rounded-3xl p-6 sm:p-8 border border-blue-100">

        {/* Panel header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">{t("লাইভ সিরিয়াল", "Live Serial")}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {lastUpdate
                ? t(`সর্বশেষ আপডেট: ${dhakaTime(lastUpdate)}`, `Last updated: ${dhakaTimeEn(lastUpdate)}`)
                : t("আজকের সিরিয়াল তথ্য", "Today's serial info")}
            </p>
          </div>
          <button
            onClick={fetchSerial}
            className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            aria-label={t("রিফ্রেশ করুন", "Refresh")}
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {renderBody()}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          {t(
            "সিরিয়াল পরিস্থিতি অনুযায়ী পরিবর্তিত হতে পারে। এখানে নির্দিষ্ট অপেক্ষার সময় নির্দেশ করা হয় না।",
            "Serial numbers may change based on circumstances. No specific waiting time is indicated here."
          )}
        </p>
      </div>

      {/* Back link */}
      <a
        href="/"
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        ← {t("হোমপেজে ফিরুন", "Back to homepage")}
      </a>
    </div>
  );
}
