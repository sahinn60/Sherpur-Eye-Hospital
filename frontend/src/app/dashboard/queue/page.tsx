"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Play, Pause, StopCircle, SkipForward, CheckCircle, RotateCcw, Eye, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import api from "@/lib/api";

interface Session {
  id: string; roomLabel: string; status: string; currentSerial: number | null;
  isPublic: boolean; doctor?: { nameBn: string } | null;
  _count?: { entries: number };
}
interface Entry {
  id: string; serial: number; tokenLabel: string; status: string;
  patient?: { nameBn: string; patientId: string; phone: string } | null;
}
interface Doctor { id: string; nameBn: string; nameEn: string; }

const STATUS_COLOR: Record<string, string> = {
  WAITING:         "bg-blue-50 text-blue-700",
  CALLED:          "bg-yellow-50 text-yellow-700",
  IN_CONSULTATION: "bg-green-50 text-green-700",
  COMPLETED:       "bg-gray-100 text-gray-500",
  SKIPPED:         "bg-red-50 text-red-500",
  CANCELLED:       "bg-gray-100 text-gray-400",
};
const STATUS_BN: Record<string, string> = {
  WAITING: "অপেক্ষায়", CALLED: "ডাকা হয়েছে", IN_CONSULTATION: "পরামর্শ চলছে",
  COMPLETED: "সম্পন্ন", SKIPPED: "বাদ দেওয়া", CANCELLED: "বাতিল",
};
const SESSION_BN: Record<string, string> = {
  NOT_STARTED: "শুরু হয়নি", RUNNING: "চলছে", PAUSED: "বিরতি", FINISHED: "শেষ",
};

export default function QueuePage() {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const isStaff = isSuperAdmin || isAdmin;

  const [sessions,   setSessions]   = useState<Session[]>([]);
  const [selId,      setSelId]      = useState<string | null>(null);
  const [entries,    setEntries]    = useState<Entry[]>([]);
  const [doctors,    setDoctors]    = useState<Doctor[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom,    setNewRoom]    = useState("চেম্বার ১");
  const [newDoctor,  setNewDoctor]  = useState("");
  const [newDate,    setNewDate]    = useState(new Date().toISOString().slice(0, 10));
  const [patientId,  setPatientId]  = useState("");
  const [busy,       setBusy]       = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Always derive selSession from sessions array so it stays fresh
  const selSession = sessions.find(s => s.id === selId) ?? null;

  const loadSessions = useCallback(async () => {
    try {
      const r = await api.get<{ data: Session[] }>("/queue/sessions");
      setSessions(r.data.data);
    } finally { setLoading(false); }
  }, []);

  const loadEntries = useCallback(async (sessionId: string) => {
    const r = await api.get<{ data: Entry[] }>(`/queue/sessions/${sessionId}/entries`);
    setEntries(r.data.data);
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useEffect(() => {
    api.get<{ data: Doctor[] }>("/doctors").then(r => setDoctors(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!selId) { setEntries([]); return; }
    loadEntries(selId);
    pollRef.current = setInterval(() => {
      loadSessions();
      loadEntries(selId);
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selId, loadEntries, loadSessions]);

  async function act(fn: () => Promise<any>) {
    setBusy(true);
    try {
      await fn();
      await loadSessions();
      if (selId) await loadEntries(selId);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "সমস্যা হয়েছে");
    } finally { setBusy(false); }
  }

  async function createSession() {
    await act(async () => {
      await api.post("/queue/sessions", {
        doctorId: newDoctor || undefined,
        roomLabel: newRoom,
        sessionDate: newDate,
        isPublic: true,
      });
      setShowCreate(false);
    });
  }

  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "DOCTOR", "RECEPTION"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">লাইভ সিরিয়াল ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">আজকের সেশন ও রোগীর সিরিয়াল পরিচালনা করুন</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={loadSessions}><RefreshCw size={14} /></Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="flex items-center gap-1">
              <Plus size={14} /> নতুন সেশন
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Sessions list */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">সেশনসমূহ</p>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)
            ) : sessions.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                আজ কোনো সেশন নেই
              </div>
            ) : sessions.map(s => (
              <button key={s.id} onClick={() => setSelId(s.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selId === s.id ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-white hover:border-blue-200"}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-gray-900 text-sm">{s.roomLabel}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.status === "RUNNING"  ? "bg-green-100 text-green-700" :
                    s.status === "PAUSED"   ? "bg-yellow-100 text-yellow-700" :
                    s.status === "FINISHED" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                  }`}>{SESSION_BN[s.status] || s.status}</span>
                </div>
                {s.doctor && <p className="text-xs text-gray-500">{s.doctor.nameBn}</p>}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">মোট: {s._count?.entries ?? 0} জন</p>
                  {s.currentSerial && (
                    <p className="text-xs font-bold text-blue-600">সিরিয়াল: {s.currentSerial}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Session detail */}
          <div className="lg:col-span-2">
            {!selSession ? (
              <div className="bg-white rounded-xl border border-gray-100 flex items-center justify-center h-64 text-gray-400 text-sm">
                বাম থেকে একটি সেশন নির্বাচন করুন
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">

                {/* Session header */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{selSession.roomLabel}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      বর্তমান সিরিয়াল:{" "}
                      <span className="font-bold text-blue-600 text-sm">
                        {selSession.currentSerial ?? "—"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selSession.status === "NOT_STARTED" && (
                      <Button size="sm" onClick={() => act(() => api.patch(`/queue/sessions/${selSession.id}/action/start`))} disabled={busy} className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                        <Play size={13} /> শুরু করুন
                      </Button>
                    )}
                    {selSession.status === "RUNNING" && (<>
                      <Button size="sm" onClick={() => act(() => api.post(`/queue/sessions/${selSession.id}/call-next`))} disabled={busy} className="flex items-center gap-1">
                        <SkipForward size={13} /> পরবর্তী ডাকুন
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => act(() => api.patch(`/queue/sessions/${selSession.id}/action/pause`))} disabled={busy} className="flex items-center gap-1">
                        <Pause size={13} /> বিরতি
                      </Button>
                    </>)}
                    {selSession.status === "PAUSED" && (
                      <Button size="sm" onClick={() => act(() => api.patch(`/queue/sessions/${selSession.id}/action/resume`))} disabled={busy} className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
                        <Play size={13} /> চালু করুন
                      </Button>
                    )}
                    {selSession.status !== "FINISHED" && (
                      <Button size="sm" variant="secondary" onClick={() => { if (confirm("সেশন শেষ করবেন?")) act(() => api.patch(`/queue/sessions/${selSession.id}/action/finish`)); }} disabled={busy} className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50">
                        <StopCircle size={13} /> শেষ করুন
                      </Button>
                    )}
                    {isStaff && (
                      <Button size="sm" variant="secondary" onClick={() => act(() => api.patch(`/queue/sessions/${selSession.id}/public`, { isPublic: !selSession.isPublic }))} disabled={busy} className="flex items-center gap-1 text-xs">
                        <Eye size={13} /> {selSession.isPublic ? "লুকান" : "প্রকাশ করুন"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Add patient — available as long as session not FINISHED */}
                {selSession.status !== "FINISHED" && (
                  <div className="p-4 border-b border-gray-100 flex gap-2">
                    <input
                      placeholder="Patient ID লিখুন (ঐচ্ছিক — খালি রাখলে Walk-in)"
                      value={patientId}
                      onChange={e => setPatientId(e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <Button size="sm" onClick={() => act(async () => {
                      let pid: string | undefined;
                      if (patientId.trim()) {
                        const r = await api.get<{ data: any[] }>(`/patients?search=${patientId.trim()}&limit=1`);
                        pid = r.data.data?.[0]?.id;
                        if (!pid) throw new Error("রোগী পাওয়া যায়নি");
                      }
                      await api.post(`/queue/sessions/${selSession.id}/entries`, { patientId: pid });
                      setPatientId("");
                    })} disabled={busy} className="flex items-center gap-1 whitespace-nowrap">
                      <Plus size={13} /> যোগ করুন
                    </Button>
                  </div>
                )}

                {/* Entries */}
                <div className="divide-y divide-gray-50 max-h-[420px] overflow-y-auto">
                  {entries.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 text-sm">কোনো এন্ট্রি নেই — উপরে রোগী যোগ করুন</p>
                  ) : entries.map(e => (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                        e.status === "CALLED" || e.status === "IN_CONSULTATION" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {e.tokenLabel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {e.patient?.nameBn ?? "Walk-in"}
                        </p>
                        {e.patient && <p className="text-xs text-gray-400">{e.patient.patientId}</p>}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[e.status] || "bg-gray-100 text-gray-500"}`}>
                        {STATUS_BN[e.status] || e.status}
                      </span>
                      <div className="flex gap-1">
                        {e.status === "IN_CONSULTATION" && (
                          <button onClick={() => act(() => api.patch(`/queue/entries/${e.id}/complete`))} title="সম্পন্ন" className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center">
                            <CheckCircle size={13} />
                          </button>
                        )}
                        {(e.status === "WAITING" || e.status === "CALLED") && (
                          <button onClick={() => { const r = prompt("বাদ দেওয়ার কারণ?"); if (r !== null) act(() => api.patch(`/queue/entries/${e.id}/skip`, { reason: r })); }} title="বাদ দিন" className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center">
                            <SkipForward size={13} />
                          </button>
                        )}
                        {e.status === "SKIPPED" && isStaff && (
                          <button onClick={() => act(() => api.patch(`/queue/entries/${e.id}/restore`))} title="পুনরুদ্ধার" className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center">
                            <RotateCcw size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create session modal */}
      {showCreate && (
        <Modal open onClose={() => setShowCreate(false)} title="নতুন সেশন তৈরি" size="sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">চিকিৎসক (ঐচ্ছিক)</label>
              <select value={newDoctor} onChange={e => setNewDoctor(e.target.value)} className={inp}>
                <option value="">— চিকিৎসক ছাড়া —</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.nameBn}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">চেম্বার / রুম</label>
              <input value={newRoom} onChange={e => setNewRoom(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">তারিখ</label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className={inp} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowCreate(false)}>বাতিল</Button>
              <Button onClick={createSession} disabled={busy}>{busy ? "তৈরি হচ্ছে..." : "তৈরি করুন"}</Button>
            </div>
          </div>
        </Modal>
      )}
    </RouteGuard>
  );
}
