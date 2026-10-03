"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Filter, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import { ROLE_LABELS, UserRole } from "@/types";
import api from "@/lib/api";

interface UserItem {
  id: string; name: string; email: string; role: UserRole;
  isActive: boolean; lastLoginAt: string | null; createdAt: string;
}
interface UserListResponse {
  items: UserItem[]; total: number; page: number; totalPages: number;
}

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTION", "ACCOUNTANT", "EMPLOYEE"];

function RegisterForm({ onSubmit, onCancel, error }: {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  error: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" as UserRole });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(form); } finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">নাম *</label>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">ইমেইল *</label>
        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">পাসওয়ার্ড *</label>
        <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required minLength={8} className={inp} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">রোল</label>
        <select value={form.role} onChange={(e) => set("role", e.target.value)} className={inp}>
          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r].bn}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>বাতিল</Button>
        <Button type="submit" disabled={submitting}>{submitting ? "তৈরি হচ্ছে..." : "ব্যবহারকারী তৈরি"}</Button>
      </div>
    </form>
  );
}

export default function UsersPage() {
  const { user: me, isSuperAdmin } = useAuth();

  const [users,      setUsers]      = useState<UserItem[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [formError,  setFormError]  = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: UserListResponse }>("/auth/users", {
        params: { search: search || undefined, role: roleFilter || undefined, page, limit: 20 },
      });
      setUsers(res.data.data.items);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } finally { setLoading(false); }
  }, [search, roleFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  async function handleRegister(data: any) {
    setFormError("");
    try {
      await api.post("/auth/register", data);
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleToggle(u: UserItem) {
    if (u.id === me?.id) return;
    const action = u.isActive ? "নিষ্ক্রিয়" : "সক্রিয়";
    if (!confirm(`${u.name} কে ${action} করতে চান?`)) return;
    try { await api.patch(`/auth/users/${u.id}/toggle`); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  async function handleRoleChange(u: UserItem, role: string) {
    if (!isSuperAdmin || u.id === me?.id) return;
    try { await api.patch(`/auth/users/${u.id}/role`, { role }); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  function fmtDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ব্যবহারকারী ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total} জন ব্যবহারকারী</p>
          </div>
          <Button size="sm" onClick={() => { setFormError(""); setShowForm(true); }}
            className="flex items-center gap-2">
            <Plus size={15} /> নতুন ব্যবহারকারী
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="নাম বা ইমেইল..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব রোল</option>
              {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r].bn}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["নাম", "ইমেইল", "রোল", "শেষ লগইন", "স্ট্যাটাস", "কার্যক্রম"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}</tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <ShieldCheck size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u.id} className={`hover:bg-gray-50 ${!u.isActive ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          {u.id === me?.id && <span className="text-xs text-primary-600">(আপনি)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      {isSuperAdmin && u.id !== me?.id ? (
                        <select value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500">
                          {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r].bn}</option>)}
                        </select>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                          {ROLE_LABELS[u.role]?.bn || u.role}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{fmtDate(u.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {u.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.id !== me?.id && (
                        <button onClick={() => handleToggle(u)}
                          className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                            u.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}>
                          {u.isActive ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">মোট {total} জন</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <Modal open onClose={() => { setShowForm(false); setFormError(""); }} title="নতুন ব্যবহারকারী তৈরি" size="md">
          <RegisterForm onSubmit={handleRegister} onCancel={() => { setShowForm(false); setFormError(""); }} error={formError} />
        </Modal>
      )}
    </RouteGuard>
  );
}
