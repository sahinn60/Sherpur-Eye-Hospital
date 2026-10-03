"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import {
  DoctorForm, DoctorViewDrawer,
  DoctorRow, AssignDoctorAccountModal,
} from "@/components/doctors-admin";
import {
  fetchDoctorsAdmin, createDoctor, updateDoctor,
  toggleDoctorStatus, assignDoctorAccount,
} from "@/lib/services/doctorService";
import { DoctorAdmin, DoctorFilters } from "@/types/doctor";

type ModalType = "add" | "edit" | "account" | null;

export default function DoctorsAdminPage() {
  const { isAdmin } = useAuth();

  const [doctors, setDoctors]       = useState<DoctorAdmin[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  const [filters, setFilters]         = useState<DoctorFilters>({ page: 1, limit: 15 });
  const [searchInput, setSearchInput] = useState("");

  const [selected, setSelected]       = useState<DoctorAdmin | null>(null);
  const [modal, setModal]             = useState<ModalType>(null);
  const [viewDoctor, setViewDoctor]   = useState<DoctorAdmin | null>(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchDoctorsAdmin(filters);
      setDoctors(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e?.response?.data?.message || "লোড করতে সমস্যা হয়েছে");
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  }

  function openModal(type: ModalType, doc?: DoctorAdmin) {
    setSelected(doc || null);
    setModal(type);
    setActionError("");
  }

  function closeModal() { setModal(null); setSelected(null); setActionError(""); }

  async function handleAdd(data: any) {
    try { await createDoctor(data); closeModal(); load(); }
    catch (e: any) { setActionError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleEdit(data: any) {
    if (!selected) return;
    try { await updateDoctor(selected.id, data); closeModal(); load(); }
    catch (e: any) { setActionError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleToggle(doc: DoctorAdmin) {
    try { await toggleDoctorStatus(doc.id); load(); }
    catch (e: any) { setError(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  async function handleAssignAccount(data: { email: string; password: string }) {
    if (!selected) return;
    await assignDoctorAccount(selected.id, data);
    closeModal(); load();
  }

  const page = filters.page || 1;

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">চিকিৎসক ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total} জন চিকিৎসক</p>
          </div>
          {isAdmin && (
            <Button onClick={() => openModal("add")} size="sm" className="flex items-center gap-2 self-start sm:self-auto">
              <Plus size={16} /> নতুন চিকিৎসক
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="নাম বা বিশেষত্ব দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">খুঁজুন</Button>
            </form>

            <div className="flex gap-2">
              <select
                value={filters.isActive ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, isActive: e.target.value || undefined, page: 1 }))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">সব অবস্থা</option>
                <option value="true">সক্রিয়</option>
                <option value="false">নিষ্ক্রিয়</option>
              </select>

              {(filters.search || filters.isActive) && (
                <Button size="sm" variant="ghost"
                  onClick={() => { setFilters({ page: 1, limit: 15 }); setSearchInput(""); }}>
                  ফিল্টার মুছুন
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">🩺</div>
              <p className="text-gray-500">কোনো চিকিৎসক পাওয়া যায়নি</p>
              {isAdmin && (
                <Button size="sm" className="mt-4" onClick={() => openModal("add")}>
                  <Plus size={15} className="mr-1" /> প্রথম চিকিৎসক যোগ করুন
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">চিকিৎসক</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">পদবি / যোগ্যতা</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">বিশেষত্ব</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden xl:table-cell">ফি</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">অ্যাকাউন্ট</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">অবস্থা</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => (
                    <DoctorRow
                      key={doc.id}
                      doctor={doc}
                      onView={setViewDoctor}
                      onEdit={(d) => openModal("edit", d)}
                      onToggleStatus={handleToggle}
                      onAssignAccount={(d) => openModal("account", d)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                পেজ {page} / {totalPages} — মোট {total} জন
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" disabled={page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}>
                  <ChevronLeft size={15} />
                </Button>
                <Button size="sm" variant="secondary" disabled={page >= totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}>
                  <ChevronRight size={15} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <Modal open onClose={closeModal} title="নতুন চিকিৎসক যোগ করুন" size="xl">
          {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
          <DoctorForm onSubmit={handleAdd} onCancel={closeModal} />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal open onClose={closeModal} title="চিকিৎসক তথ্য সম্পাদনা" size="xl">
          {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
          <DoctorForm doctor={selected} onSubmit={handleEdit} onCancel={closeModal} />
        </Modal>
      )}

      {/* Assign Account Modal */}
      {modal === "account" && selected && (
        <AssignDoctorAccountModal
          doctor={selected}
          onConfirm={handleAssignAccount}
          onClose={closeModal}
        />
      )}

      {/* View Drawer */}
      {viewDoctor && (
        <DoctorViewDrawer doctor={viewDoctor} onClose={() => setViewDoctor(null)} />
      )}
    </RouteGuard>
  );
}
