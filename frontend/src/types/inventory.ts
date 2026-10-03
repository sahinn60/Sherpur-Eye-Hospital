export type InventoryCategory = "MEDICINE" | "SURGICAL" | "OPTICAL" | "DIAGNOSTIC" | "CONSUMABLE" | "EQUIPMENT" | "OTHER";
export type StockHistoryType  = "PURCHASE" | "ADJUSTMENT" | "DISPENSED" | "EXPIRED" | "RETURNED" | "DAMAGED";

export const INVENTORY_CATEGORY_BN: Record<InventoryCategory, string> = {
  MEDICINE:    "ওষুধ",
  SURGICAL:    "সার্জিক্যাল",
  OPTICAL:     "অপটিক্যাল",
  DIAGNOSTIC:  "ডায়াগনস্টিক",
  CONSUMABLE:  "ভোগ্যপণ্য",
  EQUIPMENT:   "যন্ত্রপাতি",
  OTHER:       "অন্যান্য",
};

export const INVENTORY_CATEGORY_COLOR: Record<InventoryCategory, string> = {
  MEDICINE:    "bg-blue-100 text-blue-700",
  SURGICAL:    "bg-red-100 text-red-700",
  OPTICAL:     "bg-purple-100 text-purple-700",
  DIAGNOSTIC:  "bg-cyan-100 text-cyan-700",
  CONSUMABLE:  "bg-orange-100 text-orange-700",
  EQUIPMENT:   "bg-indigo-100 text-indigo-700",
  OTHER:       "bg-gray-100 text-gray-600",
};

export const STOCK_HISTORY_TYPE_BN: Record<StockHistoryType, string> = {
  PURCHASE:   "ক্রয়",
  ADJUSTMENT: "সমন্বয়",
  DISPENSED:  "বিতরণ",
  EXPIRED:    "মেয়াদোত্তীর্ণ",
  RETURNED:   "ফেরত",
  DAMAGED:    "ক্ষতিগ্রস্ত",
};

export const STOCK_HISTORY_TYPE_COLOR: Record<StockHistoryType, string> = {
  PURCHASE:   "bg-emerald-100 text-emerald-700",
  ADJUSTMENT: "bg-blue-100 text-blue-700",
  DISPENSED:  "bg-amber-100 text-amber-700",
  EXPIRED:    "bg-red-100 text-red-700",
  RETURNED:   "bg-purple-100 text-purple-700",
  DAMAGED:    "bg-rose-100 text-rose-700",
};

export interface InventorySupplier {
  id: string; name: string; contactName: string | null;
  phone: string | null; email: string | null; address: string | null;
  isActive: boolean; createdAt: string;
}

export interface InventoryItem {
  id: string; sku: string; name: string; nameBn: string;
  category: InventoryCategory;
  supplier: { id: string; name: string; phone: string | null } | null;
  unit: string; purchasePrice: number; sellingPrice: number;
  stockQty: number; minStock: number;
  expiryDate: string | null; description: string | null;
  isActive: boolean; createdAt: string; updatedAt: string;
}

export interface StockHistory {
  id: string; type: StockHistoryType; quantity: number;
  qtyBefore: number; qtyAfter: number; unitCost: number | null;
  note: string | null; refId: string | null;
  createdBy: string | null; createdAt: string;
}

export interface InventoryListResponse {
  items: InventoryItem[]; total: number; page: number; limit: number; totalPages: number;
}

export interface StockHistoryResponse {
  items: StockHistory[]; total: number; page: number; limit: number; totalPages: number;
}

export interface InventorySummary {
  totalItems: number; activeItems: number; lowStockCount: number;
  expiringSoon: number; expired: number; totalStockValue: number;
}

export interface InventoryAlerts {
  lowStock: InventoryItem[];
  expiringSoon: InventoryItem[];
  expired: InventoryItem[];
}
