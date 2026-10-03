import api from "@/lib/api";
import { Invoice, InvoiceListResponse, DueSummary } from "@/types/billing";

export async function fetchInvoices(params: {
  search?: string; status?: string; dateFrom?: string; dateTo?: string;
  patientId?: string; page?: number; limit?: number;
} = {}): Promise<InvoiceListResponse> {
  const res = await api.get("/billing", { params });
  return res.data.data;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
  const res = await api.get(`/billing/${id}`);
  return res.data.data;
}

export async function createInvoice(data: {
  patientId?: string; patientName: string; patientPhone: string; patientAge?: number;
  visitId?: string; appointmentId?: string; doctorId?: string;
  discountType: string; discountValue: number; notes?: string;
  items: { type: string; description: string; quantity: number; unitPrice: number; sortOrder?: number }[];
}): Promise<Invoice> {
  const res = await api.post("/billing", data);
  return res.data.data;
}

export async function updateInvoiceStatus(id: string, status: string): Promise<Invoice> {
  const res = await api.patch(`/billing/${id}/status`, { status });
  return res.data.data;
}

export async function addPayment(id: string, data: {
  amount: number; method: string; transactionId?: string; note?: string;
}): Promise<Invoice> {
  const res = await api.post(`/billing/${id}/payment`, data);
  return res.data.data;
}

export async function fetchDueSummary(): Promise<DueSummary> {
  const res = await api.get("/billing/summary");
  return res.data.data;
}
