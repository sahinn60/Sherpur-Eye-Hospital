import api from "@/lib/api";
import {
  InventoryItem, InventorySupplier, InventoryListResponse,
  StockHistoryResponse, InventorySummary, InventoryAlerts,
} from "@/types/inventory";

const base = "/inventory";

// ─── Summary & Alerts ─────────────────────────────────────────────────────────

export async function fetchInventorySummary(): Promise<InventorySummary> {
  return (await api.get(`${base}/summary`)).data.data;
}

export async function fetchInventoryAlerts(): Promise<InventoryAlerts> {
  return (await api.get(`${base}/alerts`)).data.data;
}

export async function generateSku(category: string): Promise<string> {
  return (await api.get(`${base}/sku`, { params: { category } })).data.data.sku;
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export async function fetchSuppliers(activeOnly = false): Promise<InventorySupplier[]> {
  return (await api.get(`${base}/suppliers`, { params: activeOnly ? { activeOnly: "true" } : {} })).data.data;
}

export async function createSupplier(data: Partial<InventorySupplier>): Promise<InventorySupplier> {
  return (await api.post(`${base}/suppliers`, data)).data.data;
}

export async function updateSupplier(id: string, data: Partial<InventorySupplier>): Promise<InventorySupplier> {
  return (await api.patch(`${base}/suppliers/${id}`, data)).data.data;
}

export async function toggleSupplier(id: string): Promise<InventorySupplier> {
  return (await api.patch(`${base}/suppliers/${id}/toggle`)).data.data;
}

// ─── Items ────────────────────────────────────────────────────────────────────

export async function fetchItems(params: {
  search?: string; category?: string; supplierId?: string;
  isActive?: string; lowStock?: string; expiringSoon?: string;
  page?: number; limit?: number;
} = {}): Promise<InventoryListResponse> {
  return (await api.get(base, { params })).data.data;
}

export async function fetchItem(id: string): Promise<InventoryItem> {
  return (await api.get(`${base}/${id}`)).data.data;
}

export async function createItem(data: any): Promise<InventoryItem> {
  return (await api.post(base, data)).data.data;
}

export async function updateItem(id: string, data: any): Promise<InventoryItem> {
  return (await api.patch(`${base}/${id}`, data)).data.data;
}

export async function toggleItem(id: string): Promise<InventoryItem> {
  return (await api.patch(`${base}/${id}/toggle`)).data.data;
}

// ─── Stock ────────────────────────────────────────────────────────────────────

export async function adjustStock(id: string, data: {
  type: string; quantity: number; unitCost?: number; note?: string;
}): Promise<InventoryItem> {
  return (await api.post(`${base}/${id}/stock`, data)).data.data;
}

export async function fetchStockHistory(id: string, page = 1, limit = 30): Promise<StockHistoryResponse> {
  return (await api.get(`${base}/${id}/stock/history`, { params: { page, limit } })).data.data;
}
