"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, UserRound, Filter } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import { PatientForm, PatientRow, PatientProfileDrawer } from "@/components/patients";
import {
  fetchPatients, createPatient, updatePatient, togglePatientStatus,
} from "@/lib/services/patientService";
import { Patient } from "@/types/patient";

export default function PatientsPage() {
  const { isAdmin, hasRole } = useAuth();
  const canWrite = isAdmin || hasRole("DOCTOR", "RECEPTION");

  const [patients,    setPatients]    = useState<Patient[]>([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [showForm,    setShowForm]    = useState(false);
  const [editTarget,  setEditTarget]  = useState<Patient | null>(null);
  const [formError,   setFormError]   = useState("");
  const [viewId,      setViewId]      = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPatients({
        search: search || undefined,
        gender: genderFilter || undefined,
        isActive: activeFilter || undefined,
        page, limit: 20,
      });
      setPatients(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [search, genderFilter, activeFilter, page]);

  useEffect(() => { load(); }, [load]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search, genderFilter, activeFilter]);

  async function handleCreate(data: any) {
    setFormError("");
    try {
      await createPatient(data);
      setShowForm(false);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleUpdate(data: any) {
    if (!editTarget) return;
    setFormError("");
    try {
      await updatePatient(editTarget.id, data);
      setEditTarget(null);
      load();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "সমস্যা হয়েছে");
      throw e;
    }
  }

  async function handleToggle(patient: Patient) {
    const action = patient.isActive ? "নিষ্ক্রিয়" : "সক্রিয়";
    if (!confirm(`এই রোগীকে ${action} করতে চান?`)) return;
    try { await togglePatientStatus(patient.id); load(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "HR", "DOCTOR", "RECEPTION"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">রোগী ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total} জন নিবন্ধিত রোগী</p>
          </div>
          {canWrite && (
            <Button size="sm" onClick={() => { setEditTarget(null); setFormError(""); setShowForm(true); }}
              className="flex items-center gap-2">
              <Plus size={15} /> নতুন রোগী
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="নাম, ফোন বা রোগী আইডি দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব লিঙ্গ</option>
              <option value="MALE">পুরুষ</option>
              <option value="FEMALE">মহিলা</option>
              <option value="OTHER">অন্যান্য</option>
            </select>
            <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="">সব স্ট্যাটাস</option>
              <option value="true">সক্রিয়</option>
              <option value="false">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["রোগী", "আইডি", "ফোন", "বয়স / লিঙ্গ", "ঠিকানা", "ইতিহাস", "স্ট্যাটাস", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <UserRound size={40} className="mx-auto text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">কোনো রোগী পাওয়া যায়নি</p>
                      {canWrite && (
                        <Button size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                          <Plus size={14} className="mr-1" /> প্রথম রোগী নিবন্ধন করুন
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <PatientRow
                      key={p.id}
                      patient={p}
                      onView={(pt) => setViewId(pt.id)}
                      onEdit={(pt) => { setEditTarget(pt); setFormError(""); setShowForm(true); }}
                      onToggle={handleToggle}
                      canWrite={canWrite}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">মোট {total} রোগী</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          open
          onClose={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
          title={editTarget ? "রোগীর তথ্য সম্পাদনা" : "নতুন রোগী নিবন্ধন"}
          size="lg"
        >
          <PatientForm
            patient={editTarget}
            onSubmit={editTarget ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditTarget(null); setFormError(""); }}
            error={formError}
          />
        </Modal>
      )}

      {/* Profile Drawer */}
      {viewId && (
        <PatientProfileDrawer
          patientId={viewId}
          onClose={() => setViewId(null)}
          canWrite={canWrite}
        />
      )}
    </RouteGuard>
  );
}
