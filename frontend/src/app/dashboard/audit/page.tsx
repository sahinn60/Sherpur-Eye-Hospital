"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, RefreshCw, Shield, Activity, Clock, Database } from "lucide-react";
import { RouteGuard } from "@/components/auth";
import { fetchAuditLogs, fetchAuditStats } from "@/lib/services/auditService";
import type { AuditLog, AuditStats, AuditAction, AuditModule } from "@/types/audit";
import { ACTION_LABELS, MODULE_LABELS } from "@/types/audit";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODULES: AuditModule[] = [
  "patient","appointment","prescription","invoice","payment",
  "employee","doctor","leave","attendance","surgery","inventory",
  "cms","news","gallery","user","auth","billing","finance",
];

const ACTIONS: AuditAction[] = [
  "CREATE","UPDATE","DELETE","STATUS_CHANGE","LOGIN","LOGOUT","EXPORT","VIEW",
];

function fmt(d: string) {
  return new Date(d).toLocaleString("bn-BD", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
    ADMIN:       "bg-blue-100 text-blue-700",
    DOCTOR:      "bg-green-100 text-green-700",
    RECEPTION:   "bg-cyan-100 text-cyan-700",
    ACCOUNTANT:  "bg-amber-100 text-amber-700",
    HR:          "bg-pink-100 text-pink-700",
    EMPLOYEE:    "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${colors[role] || "bg-gray-100 text-gray-500"}`}>
      {role || "—"}
    </span>
  );
}

// ─── Stats Cards ──────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: AuditStats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Database size={15} className="text-primary-500" />
          <p className="text-xs text-gray-500">মোট লগ</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString("bn-BD")}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={15} className="text-blue-500" />
          <p className="text-xs text-gray-500">গত ৩০ দিন</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{stats.last30Days.toLocaleString("bn-BD")}</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={15} className="text-green-500" />
          <p className="text-xs text-gray-500">শীর্ষ মডিউল</p>
        </div>
        <div className="space-y-1">
          {stats.byModule.slice(0, 3).map((m) => (
            <div key={m.module} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{MODULE_LABELS[m.module] || m.module}</span>
              <span className="text-xs font-semibold text-gray-800">{m.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={15} className="text-amber-500" />
          <p className="text-xs text-gray-500">অ্যাকশন বিভাজন</p>
        </div>
        <div className="space-y-1">
          {stats.byAction.slice(0, 4).map((a) => {
            const cfg = ACTION_LABELS[a.action as AuditAction];
            return (
              <div key={a.action} className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${cfg?.color || "bg-gray-100 text-gray-500"}`}>
                  {cfg?.bn || a.action}
                </span>
                <span className="text-xs font-semibold text-gray-800">{a.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [logs,    setLogs]    = useState<AuditLog[]>([]);
  const [stats,   setStats]   = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const LIMIT = 50;

  const [search,   setSearch]   = useState("");
  const [module,   setModule]   = useState("");
  const [action,   setAction]   = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        fetchAuditLogs({ search: search || undefined, module: module || undefined, action: action || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, page, limit: LIMIT }),
        stats ? Promise.resolve(stats) : fetchAuditStats(),
      ]);
      setLogs(logsRes.items);
      setTotal(logsRes.total);
      if (!stats) setStats(statsRes as AuditStats);
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, module, action, dateFrom, dateTo, page]);

  useEffect(() => { load(); }, [load]);

  async function refreshStats() {
    const s = await fetchAuditStats();
    setStats(s);
  }

  const totalPages = Math.ceil(total / LIMIT);
  const inp = "text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white";

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">অডিট লগ</h1>
            <p className="text-sm text-gray-500 mt-0.5">সিস্টেমে সকল কার্যক্রমের রেকর্ড</p>
          </div>
          <button onClick={() => { setStats(null); refreshStats(); load(); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={14} /> রিফ্রেশ
          </button>
        </div>

        {/* Stats */}
        {stats && <StatsRow stats={stats} />}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">ফিল্টার</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="ব্যবহারকারী বা রেকর্ড খুঁজুন..."
                className={`${inp} pl-8 w-full`}
              />
            </div>
            <select value={module} onChange={(e) => { setModule(e.target.value); setPage(1); }} className={inp}>
              <option value="">সব মডিউল</option>
              {MODULES.map((m) => <option key={m} value={m}>{MODULE_LABELS[m] || m}</option>)}
            </select>
            <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className={inp}>
              <option value="">সব অ্যাকশন</option>
              {ACTIONS.map((a) => <option key={a} value={a}>{ACTION_LABELS[a]?.bn || a}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className={`${inp} flex-1`} />
              <input type="date" value={dateTo}   onChange={(e) => { setDateTo(e.target.value);   setPage(1); }} className={`${inp} flex-1`} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">মোট <span className="font-semibold text-gray-800">{total.toLocaleString("bn-BD")}</span>টি লগ</p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  ← আগে
                </button>
                <span className="text-xs text-gray-500">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  পরে →
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">সময়</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ব্যবহারকারী</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">মডিউল</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">রেকর্ড</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-gray-400 text-sm">
                      <Shield size={36} className="mx-auto text-gray-200 mb-3" />
                      কোনো লগ পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const actionCfg = ACTION_LABELS[log.action];
                    return (
                      <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {fmt(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {log.userName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-800 leading-tight">{log.userName || "—"}</p>
                              <RoleBadge role={log.userRole} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${actionCfg?.color || "bg-gray-100 text-gray-600"}`}>
                            {actionCfg?.bn || log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium">
                            {MODULE_LABELS[log.module] || log.module}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <p className="text-xs text-gray-700 truncate">{log.recordLabel || log.recordId || "—"}</p>
                          {log.meta && (
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">
                              {Object.entries(log.meta).map(([k, v]) => `${k}: ${v}`).join(", ")}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                          {log.ipAddress || "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} / {total}
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-7 h-7 text-xs rounded-lg transition-colors ${p === page ? "bg-primary-600 text-white" : "hover:bg-gray-100 text-gray-600"}`}>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
