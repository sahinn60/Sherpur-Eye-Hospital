"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Modal, Button } from "@/components/ui";
import {
  EmployeeForm, EmployeeViewDrawer,
  AssignShiftModal, AssignAccountModal, EmployeeRow,
} from "@/components/employees";
import {
  fetchEmployees, fetchDepartments, fetchShifts,
  createEmployee, updateEmployee, toggleEmployeeStatus,
  assignShift, assignAccount,
} from "@/lib/services/employeeService";
import { Employee, Department, Shift, EmployeeFilters } from "@/types/employee";

type ModalType = "add" | "edit" | "shift" | "account" | null;

export default function EmployeesPage() {
  const { isAdmin, hasRole } = useAuth();
  const canManage = isAdmin || hasRole("HR");

  const [employees, setEmployees]   = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts]         = useState<Shift[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, limit: 15 });
  const [searchInput, setSearchInput] = useState("");

  const [selected, setSelected]   = useState<Employee | null>(null);
  const [modal, setModal]         = useState<ModalType>(null);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [actionError, setActionError]   = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchEmployees(filters);
      setEmployees(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e?.response?.data?.message || "লোড করতে সমস্যা হয়েছে");
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetchDepartments().then(setDepartments).catch(() => {});
    fetchShifts().then(setShifts).catch(() => {});
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
  }

  function openModal(type: ModalType, emp?: Employee) {
    setSelected(emp || null);
    setModal(type);
    setActionError("");
  }

  function closeModal() { setModal(null); setSelected(null); setActionError(""); }

  async function handleAdd(data: any) {
    try {
      await createEmployee(data);
      closeModal(); load();
    } catch (e: any) { setActionError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleEdit(data: any) {
    if (!selected) return;
    try {
      await updateEmployee(selected.id, data);
      closeModal(); load();
    } catch (e: any) { setActionError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleToggle(emp: Employee) {
    try { await toggleEmployeeStatus(emp.id); load(); }
    catch (e: any) { setError(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  async function handleAssignShift(shiftId: string) {
    if (!selected) return;
    await assignShift(selected.id, shiftId);
    load();
  }

  async function handleAssignAccount(data: any) {
    if (!selected) return;
    await assignAccount(selected.id, data);
    closeModal(); load();
  }

  const page = filters.page || 1;

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "HR", "EMPLOYEE"]}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">কর্মচারী ব্যবস্থাপনা</h1>
            <p className="text-sm text-gray-500 mt-0.5">মোট {total} জন কর্মচারী</p>
          </div>
          {canManage && (
            <Button onClick={() => openModal("add")} size="sm" className="flex items-center gap-2 self-start sm:self-auto">
              <Plus size={16} /> নতুন কর্মচারী
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
                  placeholder="নাম, আইডি বা ফোন দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">খুঁজুন</Button>
            </form>

            <div className="flex gap-2 flex-wrap">
              <select
                value={filters.departmentId || ""}
                onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value || undefined, page: 1 }))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">সব বিভাগ</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <select
                value={filters.isActive ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, isActive: e.target.value || undefined, page: 1 }))}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">সব অবস্থা</option>
                <option value="true">সক্রিয়</option>
                <option value="false">নিষ্ক্রিয়</option>
              </select>

              {(filters.search || filters.departmentId || filters.isActive) && (
                <Button size="sm" variant="ghost" onClick={() => { setFilters({ page: 1, limit: 15 }); setSearchInput(""); }}>
                  ফিল্টার মুছুন
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : employees.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-gray-500">কোনো কর্মচারী পাওয়া যায়নি</p>
              {canManage && (
                <Button size="sm" className="mt-4" onClick={() => openModal("add")}>
                  <Plus size={15} className="mr-1" /> প্রথম কর্মচারী যোগ করুন
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">কর্মচারী</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">পদবি</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden lg:table-cell">বিভাগ</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden xl:table-cell">শিফট</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">ফোন</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">অবস্থা</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">কার্যক্রম</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <EmployeeRow
                      key={emp.id}
                      employee={emp}
                      onView={(e) => setViewEmployee(e)}
                      onEdit={(e) => openModal("edit", e)}
                      onToggleStatus={handleToggle}
                      onAssignShift={(e) => openModal("shift", e)}
                      onAssignAccount={(e) => openModal("account", e)}
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
        <Modal open onClose={closeModal} title="নতুন কর্মচারী যোগ করুন" size="xl">
          {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
          <EmployeeForm departments={departments} shifts={shifts} onSubmit={handleAdd} onCancel={closeModal} />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal open onClose={closeModal} title="কর্মচারী তথ্য সম্পাদনা" size="xl">
          {actionError && <p className="text-sm text-red-600 mb-3">{actionError}</p>}
          <EmployeeForm employee={selected} departments={departments} shifts={shifts} onSubmit={handleEdit} onCancel={closeModal} />
        </Modal>
      )}

      {/* Assign Shift Modal */}
      {modal === "shift" && selected && (
        <AssignShiftModal employee={selected} shifts={shifts} onConfirm={handleAssignShift} onClose={closeModal} />
      )}

      {/* Assign Account Modal */}
      {modal === "account" && selected && (
        <AssignAccountModal employee={selected} onConfirm={handleAssignAccount} onClose={closeModal} />
      )}

      {/* View Drawer */}
      {viewEmployee && (
        <EmployeeViewDrawer employee={viewEmployee} onClose={() => setViewEmployee(null)} />
      )}
    </RouteGuard>
  );
}
