"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, CalendarCheck, CheckCircle2, MapPin } from "lucide-react";
import { useLang } from "@/context/LangContext";

const API = process.env.NEXT_PUBLIC_API_URL || "https://sherpur-eye-hospital.onrender.com/api/v1";
const POLL_MS = 8000;

interface Doctor { id: string; nameBn: string; nameEn: string; designationBn: string; }
interface Session { id: string; roomLabel: string; status: string; }
interface SerialData {
  sessionId: string; doctorNameBn: string; roomLabel: string;
  status: string;
  currentToken: string | null;
  nextToken: string | null;
  afterNextToken: string | null;
  updatedAt: string;
}

const STATUS_LABEL: Record<string, { bn: string; color: string }> = {
  NOT_STARTED: { bn: "শুরু হয়নি",   color: "text-gray-500" },
  RUNNING:     { bn: "চলছে",         color: "text-green-600" },
  PAUSED:      { bn: "বিরতি",        color: "text-yellow-600" },
  FINISHED:    { bn: "শেষ হয়েছে",   color: "text-red-500" },
};

const STEPS = [
  { num: "১", titleBn: "অ্যাপয়েন্টমেন্ট অনুরোধ", descBn: "অনলাইন ফর্মের মাধ্যমে অ্যাপয়েন্টমেন্টের অনুরোধ করুন।" },
  { num: "২", titleBn: "নিশ্চিতকরণ",              descBn: "হাসপাতালের পক্ষ থেকে যোগাযোগ করে তারিখ ও সময় নিশ্চিত করা হবে।" },
  { num: "৩", titleBn: "হাসপাতালে আসুন",          descBn: "নিশ্চিত করা তারিখ ও সময়ে হাসপাতালে এসে রিসেপশনে যোগাযোগ করুন।" },
];

export function LiveSerialSection() {
  const { t } = useLang();

  const [doctors,    setDoctors]    = useState<Doctor[]>([]);
  const [sessions,   setSessions]   = useState<Session[]>([]);
  const [serial,     setSerial]     = useState<SerialData | null>(null);
  const [selDoctor,  setSelDoctor]  = useState("");
  const [selSession, setSelSession] = useState("");
  const [stale,      setStale]      = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchingRef = useRef(false);

  // Load doctors once
  useEffect(() => {
    fetch(`${API}/queue/public/doctors`)
      .then(r => r.json())
      .then(d => { if (d.data?.length) { setDoctors(d.data); setSelDoctor(d.data[0].id); } })
      .catch(() => {});
  }, []);

  // Load sessions when doctor changes
  useEffect(() => {
    if (!selDoctor) return;
    setSessions([]); setSelSession(""); setSerial(null);
    fetch(`${API}/queue/public/doctors/${selDoctor}/sessions`)
      .then(r => r.json())
      .then(d => {
        if (d.data?.length) { setSessions(d.data); setSelSession(d.data[0].id); }
      })
      .catch(() => {});
  }, [selDoctor]);

  // Poll serial data
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
    } catch {
      setStale(true);
    } finally {
      fetchingRef.current = false;
    }
  }, [selSession]);

  useEffect(() => {
    if (!selSession) { setSerial(null); return; }
    fetchSerial();
    timerRef.current = setInterval(fetchSerial, POLL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [selSession, fetchSerial]);

  // Stale detection
  useEffect(() => {
    if (!lastUpdate) return;
    const t = setTimeout(() => setStale(true), 30000);
    return () => clearTimeout(t);
  }, [lastUpdate]);

  const statusInfo = serial ? (STATUS_LABEL[serial.status] ?? { bn: serial.status, color: "text-gray-500" }) : null;

  const sel = "w-full text-sm border border-blue-100 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700";

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

          {/* ── LEFT: Live Serial Panel (65%) ─────────────────────────── */}
          <div className="lg:col-span-3 bg-[#F0F6FF] rounded-3xl p-6 sm:p-8 border border-blue-100">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">{t("লাইভ সিরিয়াল", "Live Serial")}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {lastUpdate
                    ? t(`সর্বশেষ আপডেট: ${lastUpdate.toLocaleTimeString("bn-BD")}`, `Last updated: ${lastUpdate.toLocaleTimeString("en-GB")}`)
                    : t("লোড হচ্ছে...", "Loading...")}
                </p>
              </div>
              <button
                onClick={fetchSerial}
                className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("চিকিৎসক", "Doctor")}</label>
                <select className={sel} value={selDoctor} onChange={e => setSelDoctor(e.target.value)}>
                  {doctors.length === 0 && <option value="">{t("লোড হচ্ছে...", "Loading...")}</option>}
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("চেম্বার / সেশন", "Chamber / Session")}</label>
                <select className={sel} value={selSession} onChange={e => setSelSession(e.target.value)}>
                  {sessions.length === 0 && <option value="">{t("আজ কোনো সেশন নেই", "No session today")}</option>}
                  {sessions.map(s => <option key={s.id} value={s.id}>{s.roomLabel}</option>)}
                </select>
              </div>
            </div>

            {/* Status badge */}
            {statusInfo && (
              <div className="flex items-center gap-2 mb-5">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  serial?.status === "RUNNING"  ? "bg-green-50 border-green-200 text-green-700" :
                  serial?.status === "PAUSED"   ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                  serial?.status === "FINISHED" ? "bg-red-50 border-red-200 text-red-600" :
                  "bg-gray-50 border-gray-200 text-gray-500"
                }`}>
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
                {selSession ? t("লোড হচ্ছে...", "Loading...") : t("একটি সেশন নির্বাচন করুন", "Select a session")}
              </div>
            ) : serial.status === "NOT_STARTED" ? (
              <div className="text-center py-10 text-gray-400 text-sm">{t("সেশন এখনো শুরু হয়নি", "Session not started yet")}</div>
            ) : serial.status === "FINISHED" ? (
              <div className="text-center py-10 text-gray-400 text-sm">{t("আজকের সেশন শেষ হয়েছে", "Today's session has ended")}</div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { labelBn: "বর্তমান সিরিয়াল", token: serial.currentToken, accent: "green" },
                  { labelBn: "পরবর্তী সিরিয়াল",  token: serial.nextToken,    accent: "blue" },
                  { labelBn: "তার পরের সিরিয়াল", token: serial.afterNextToken, accent: "gray" },
                ].map((card) => (
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

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 mt-5 leading-relaxed">
              {t(
                "সিরিয়াল পরিস্থিতি অনুযায়ী পরিবর্তিত হতে পারে। এখানে নির্দিষ্ট অপেক্ষার সময় নির্দেশ করা হয় না।",
                "Serial numbers may change based on circumstances. No specific waiting time is indicated here."
              )}
            </p>
          </div>

          {/* ── RIGHT: Visit Process (35%) ────────────────────────────── */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">
              {t("হাসপাতালে আসার প্রক্রিয়া", "Hospital Visit Process")}
            </h2>
            <p className="text-sm text-gray-400 mb-7">
              {t("সহজ তিন ধাপে আপনার চোখের পরীক্ষা", "Eye examination in 3 simple steps")}
            </p>

            <div className="space-y-0">
              {STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-4">
                  {/* Number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-extrabold flex-shrink-0">
                      {step.num}
                    </div>
                    {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-blue-100 my-1" />}
                  </div>

                  {/* Content */}
                  <div className={`pb-6 ${i === STEPS.length - 1 ? "pb-0" : ""}`}>
                    <p className="font-bold text-gray-900 text-sm mb-1">{t(step.titleBn, step.titleBn)}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{t(step.descBn, step.descBn)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="/appointment"
              className="mt-7 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm w-full"
            >
              <CalendarCheck size={16} />
              {t("অ্যাপয়েন্টমেন্ট নিন", "Book Appointment")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
