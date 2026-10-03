"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Filter, Package, Download,
  RefreshCw, Truck, AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RouteGuard } from "@/components/auth";
import { Button, Modal } from "@/components/ui";
import {
  ItemForm, ItemRow, StockHistoryDrawer,
  StockAdjustModal, InventoryAlertPanel, SupplierForm,
} from "@/components/inventory";
import {
  fetchItems, fetchSuppliers, fetchInventorySummary, fetchInventoryAlerts,
  createItem, updateItem, toggleItem,
  createSupplier, updateSupplier, toggleSupplier,
  adjustStock,
} from "@/lib/services/inventoryService";
import {
  exportToExcel, exportToPDF,
  buildInventoryExcelRows, buildInventoryPDFRows,
} from "@/lib/exportUtils";
import {
  InventoryItem, InventorySupplier, InventorySummary, InventoryAlerts,
  InventoryCategory, INVENTORY_CATEGORY_BN,
} from "@/types/inventory";

type Tab = "items" | "suppliers" | "alerts";
type StockMode = "in" | "out";

const CATEGORIES = Object.keys(INVENTORY_CATEGORY_BN) as InventoryCategory[];

export default function InventoryPage() {
  const { isAdmin, hasRole } = useAuth();
  const canWrite = isAdmin || hasRole("ACCOUNTANT");

  // ── State ──────────────────────────────────────────────────────────────────
  const [tab,        setTab]        = useState<Tab>("items");
  const [items,      setItems]      = useState<InventoryItem[]>([]);
  const [suppliers,  setSuppliers]  = useState<InventorySupplier[]>([]);
  const [summary,    setSummary]    = useState<InventorySummary | null>(null);
  const [alerts,     setAlerts]     = useState<InventoryAlerts | null>(null);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);

  // Filters
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("true");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [expiringOnly, setExpiringOnly] = useState(false);

  // Modals
  const [showItemForm,   setShowItemForm]   = useState(false);
  const [editItem,       setEditItem]       = useState<InventoryItem | null>(null);
  const [itemFormError,  setItemFormError]  = useState("");
  const [historyItem,    setHistoryItem]    = useState<InventoryItem | null>(null);
  const [stockItem,      setStockItem]      = useState<InventoryItem | null>(null);
  const [stockMode,      setStockMode]      = useState<StockMode>("in");
  const [stockError,     setStockError]     = useState("");
  const [showSupForm,    setShowSupForm]    = useState(false);
  const [editSupplier,   setEditSupplier]   = useState<InventorySupplier | null>(null);
  const [supFormError,   setSupFormError]   = useState("");

  // ── Loaders ────────────────────────────────────────────────────────────────
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchItems({
        search:       search       || undefined,
        category:     catFilter    || undefined,
        supplierId:   supplierFilter || undefined,
        isActive:     activeFilter || undefined,
        lowStock:     lowStockOnly ? "true" : undefined,
        expiringSoon: expiringOnly ? "true" : undefined,
        page, limit: 20,
      });
      setItems(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } finally { setLoading(false); }
  }, [search, catFilter, supplierFilter, activeFilter, lowStockOnly, expiringOnly, page]);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    try { setSuppliers(await fetchSuppliers()); } finally { setLoading(false); }
  }, []);

  const loadMeta = useCallback(async () => {
    try {
      const [sum, alr] = await Promise.all([fetchInventorySummary(), fetchInventoryAlerts()]);
      setSummary(sum);
      setAlerts(alr);
    } catch {}
  }, []);

  useEffect(() => {
    if (tab === "items")     loadItems();
    if (tab === "suppliers") loadSuppliers();
    if (tab === "alerts")    loadMeta();
  }, [tab, loadItems, loadSuppliers, loadMeta]);

  useEffect(() => { loadMeta(); }, []); // load summary on mount
  useEffect(() => { setPage(1); }, [search, catFilter, supplierFilter, activeFilter, lowStockOnly, expiringOnly]);

  // ── Item handlers ──────────────────────────────────────────────────────────
  async function handleCreateItem(data: any) {
    setItemFormError("");
    try { await createItem(data); setShowItemForm(false); loadItems(); loadMeta(); }
    catch (e: any) { setItemFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleUpdateItem(data: any) {
    if (!editItem) return;
    setItemFormError("");
    try { await updateItem(editItem.id, data); setEditItem(null); loadItems(); loadMeta(); }
    catch (e: any) { setItemFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleToggleItem(item: InventoryItem) {
    const action = item.isActive ? "নিষ্ক্রিয়" : "সক্রিয়";
    if (!confirm(`"${item.nameBn}" কে ${action} করতে চান?`)) return;
    try { await toggleItem(item.id); loadItems(); loadMeta(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  async function handleAdjustStock(data: any) {
    if (!stockItem) return;
    setStockError("");
    try { await adjustStock(stockItem.id, data); setStockItem(null); loadItems(); loadMeta(); }
    catch (e: any) { setStockError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  // ── Supplier handlers ──────────────────────────────────────────────────────
  async function handleCreateSupplier(data: any) {
    setSupFormError("");
    try { await createSupplier(data); setShowSupForm(false); loadSuppliers(); }
    catch (e: any) { setSupFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleUpdateSupplier(data: any) {
    if (!editSupplier) return;
    setSupFormError("");
    try { await updateSupplier(editSupplier.id, data); setEditSupplier(null); loadSuppliers(); }
    catch (e: any) { setSupFormError(e?.response?.data?.message || "সমস্যা হয়েছে"); throw e; }
  }

  async function handleToggleSupplier(s: InventorySupplier) {
    try { await toggleSupplier(s.id); loadSuppliers(); }
    catch (e: any) { alert(e?.response?.data?.message || "সমস্যা হয়েছে"); }
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  async function handleExportExcel() {
    const all = await fetchItems({ search: search || undefined, category: catFilter || undefined, limit: 9999, page: 1 });
    exportToExcel(buildInventoryExcelRows(all.items), `inventory-${Date.now()}`, "ইনভেন্টরি");
  }

  async function handleExportPDF() {
    const all = await fetchItems({ search: search || undefined, category: catFilter || undefined, limit: 9999, page: 1 });
    await exportToPDF(
      "ইনভেন্টরি রিপোর্ট",
      `মোট আইটেম: ${all.total}`,
      ["#", "SKU", "নাম", "ক্যাটাগরি", "সাপ্লায়ার", "একক", "স্টক", "ন্যূনতম", "ক্রয় মূল্য", "মেয়াদ"],
      buildInventoryPDFRows(all.items),
      `inventory-${Date.now()}`
    );
  }

  const alertCount = alerts ? alerts.lowStock.length + alerts.expiringSoon.length + alerts.expired.length : 0;

  return (
    <RouteGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "ACCOUNTANT", "DOCTOR", "RECEPTION"]}>
      <div className="space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ফার্মেসি / ইনভেন্টরি</h1>
            <p className="text-sm text-gray-500 mt-0.5">ওষুধ ও সরঞ্জাম ব্যবস্থাপনা</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="secondary" onClick={() => { loadItems(); loadMeta(); }}
              className="flex items-center gap-1.5">
              <RefreshCw size={14} /> রিফ্রেশ
            </Button>
            {canWrite && (
              <>
                <Button size="sm" variant="secondary"
                  onClick={() => { setEditSupplier(null); setSupFormError(""); setShowSupForm(true); }}
                  className="flex items-center gap-1.5">
                  <Truck size={14} /> সাপ্লায়ার
                </Button>
                <Button size="sm"
                  onClick={() => { setEditItem(null); setItemFormError(""); setShowItemForm(true); }}
                  className="flex items-center gap-2">
                  <Plus size={15} /> নতুন আইটেম
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Summary Cards ── */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "মোট আইটেম",    value: summary.totalItems,                    cls: "text-blue-600",    bg: "bg-blue-50" },
              { label: "সক্রিয়",       value: summary.activeItems,                   cls: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "কম স্টক",      value: summary.lowStockCount,                 cls: "text-red-600",     bg: "bg-red-50" },
              { label: "মেয়াদ শেষ হচ্ছে", value: summary.expiringSoon,              cls: "text-amber-600",   bg: "bg-amber-50" },
              { label: "মেয়াদোত্তীর্ণ", value: summary.expired,                    cls: "text-rose-600",    bg: "bg-rose-50" },
              { label: "স্টক মূল্য",   value: `৳${summary.totalStockValue.toFixed(0)}`, cls: "text-purple-600", bg: "bg-purple-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-white`}>
                <p className={`text-lg font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
          {([
            { key: "items",     label: "আইটেম তালিকা",  icon: <Package size={13} /> },
            { key: "suppliers", label: "সাপ্লায়ার",     icon: <Truck size={13} /> },
            { key: "alerts",    label: `সতর্কতা${alertCount > 0 ? ` (${alertCount})` : ""}`, icon: <AlertTriangle size={13} /> },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              } ${t.key === "alerts" && alertCount > 0 ? "text-amber-600" : ""}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── Items Tab ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === "items" && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="নাম বা SKU দিয়ে খুঁজুন..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter size={14} className="text-gray-400" />
                  <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">সব ক্যাটাগরি</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{INVENTORY_CATEGORY_BN[c]}</option>)}
                  </select>
                  <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">সব সাপ্লায়ার</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500">
                    <option value="">সব স্ট্যাটাস</option>
                    <option value="true">সক্রিয়</option>
                    <option value="false">নিষ্ক্রিয়</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600" />
                  <span className="text-xs text-gray-600 font-medium">শুধু কম স্টক</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={expiringOnly} onChange={(e) => setExpiringOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600" />
                  <span className="text-xs text-gray-600 font-medium">মেয়াদ শেষ হচ্ছে (৩০ দিন)</span>
                </label>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="secondary" onClick={handleExportExcel}
                    className="flex items-center gap-1.5"><Download size={13} /> Excel</Button>
                  <Button size="sm" variant="secondary" onClick={handleExportPDF}
                    className="flex items-center gap-1.5"><Download size={13} /> PDF</Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["আইটেম", "SKU", "ক্যাটাগরি", "সাপ্লায়ার", "স্টক", "মূল্য", "মেয়াদ", ""].map((h) => (
                        <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase ${
                          h === "সাপ্লায়ার" ? "hidden lg:table-cell" :
                          h === "মূল্য"     ? "hidden xl:table-cell" :
                          h === "মেয়াদ"    ? "hidden md:table-cell" : ""
                        }`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                        ))}</tr>
                      ))
                    ) : items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <Package size={40} className="mx-auto text-gray-200 mb-3" />
                          <p className="text-gray-400 text-sm">কোনো আইটেম পাওয়া যায়নি</p>
                          {canWrite && (
                            <Button size="sm" className="mt-4"
                              onClick={() => { setEditItem(null); setItemFormError(""); setShowItemForm(true); }}>
                              <Plus size={14} className="mr-1" /> প্রথম আইটেম যোগ করুন
                            </Button>
                          )}
                        </td>
                      </tr>
                    ) : items.map((item) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        canWrite={canWrite}
                        onEdit={(i) => { setEditItem(i); setItemFormError(""); setShowItemForm(true); }}
                        onHistory={setHistoryItem}
                        onStockIn={(i) => { setStockItem(i); setStockMode("in"); setStockError(""); }}
                        onStockOut={(i) => { setStockItem(i); setStockMode("out"); setStockError(""); }}
                        onToggle={handleToggleItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">মোট {total}টি আইটেম</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</Button>
                    <span className="text-xs text-gray-500 self-center">{page}/{totalPages}</span>
                    <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── Suppliers Tab ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === "suppliers" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              {canWrite && (
                <Button size="sm" onClick={() => { setEditSupplier(null); setSupFormError(""); setShowSupForm(true); }}
                  className="flex items-center gap-2">
                  <Plus size={15} /> নতুন সাপ্লায়ার
                </Button>
              )}
            </div>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)
            ) : suppliers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
                <Truck size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-400 text-sm">কোনো সাপ্লায়ার নেই</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {["নাম", "যোগাযোগ", "ফোন", "ইমেইল", "স্ট্যাটাস", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {suppliers.map((s) => (
                      <tr key={s.id} className={`hover:bg-gray-50 ${!s.isActive ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.contactName || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.phone || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{s.email || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            s.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                          }`}>
                            {s.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {canWrite && (
                            <div className="flex gap-1.5">
                              <button onClick={() => { setEditSupplier(s); setSupFormError(""); setShowSupForm(true); }}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">সম্পাদনা</button>
                              <button onClick={() => handleToggleSupplier(s)}
                                className={`text-xs px-2 py-1 rounded-lg ${
                                  s.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}>
                                {s.isActive ? "নিষ্ক্রিয়" : "সক্রিয়"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ── Alerts Tab ── */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === "alerts" && (
          <div className="space-y-4">
            {!alerts ? (
              <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <InventoryAlertPanel alerts={alerts} />
            )}
            {alerts && alertCount === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl py-12 text-center">
                <p className="text-emerald-700 font-medium">✅ কোনো সতর্কতা নেই</p>
                <p className="text-emerald-600 text-sm mt-1">সব আইটেমের স্টক ও মেয়াদ ঠিক আছে।</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Item Form Modal ── */}
      {showItemForm && (
        <Modal open onClose={() => { setShowItemForm(false); setEditItem(null); setItemFormError(""); }}
          title={editItem ? "আইটেম সম্পাদনা" : "নতুন আইটেম যোগ করুন"} size="xl">
          <ItemForm
            item={editItem}
            suppliers={suppliers}
            onSubmit={editItem ? handleUpdateItem : handleCreateItem}
            onCancel={() => { setShowItemForm(false); setEditItem(null); setItemFormError(""); }}
            error={itemFormError}
          />
        </Modal>
      )}

      {/* ── Stock Adjust Modal ── */}
      {stockItem && (
        <Modal open onClose={() => { setStockItem(null); setStockError(""); }}
          title={stockMode === "in" ? "স্টক যোগ করুন" : "স্টক কমান"} size="sm">
          <StockAdjustModal
            item={stockItem}
            mode={stockMode}
            onSubmit={handleAdjustStock}
            onCancel={() => { setStockItem(null); setStockError(""); }}
            error={stockError}
          />
        </Modal>
      )}

      {/* ── Stock History Drawer ── */}
      {historyItem && (
        <StockHistoryDrawer item={historyItem} onClose={() => setHistoryItem(null)} />
      )}

      {/* ── Supplier Form Modal ── */}
      {showSupForm && (
        <Modal open onClose={() => { setShowSupForm(false); setEditSupplier(null); setSupFormError(""); }}
          title={editSupplier ? "সাপ্লায়ার সম্পাদনা" : "নতুন সাপ্লায়ার"} size="md">
          <SupplierForm
            supplier={editSupplier}
            onSubmit={editSupplier ? handleUpdateSupplier : handleCreateSupplier}
            onCancel={() => { setShowSupForm(false); setEditSupplier(null); setSupFormError(""); }}
            error={supFormError}
          />
        </Modal>
      )}
    </RouteGuard>
  );
}
