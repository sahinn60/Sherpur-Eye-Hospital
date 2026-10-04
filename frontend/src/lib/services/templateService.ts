import api from "@/lib/api";
import { PrescriptionTemplate, TemplateListResponse, TemplateItem } from "@/types/prescription";

export async function fetchTemplates(params: {
  search?: string; category?: string; isShared?: boolean;
  page?: number; limit?: number;
} = {}): Promise<TemplateListResponse> {
  const res = await api.get("/prescriptions/templates", { params });
  return res.data.data;
}

export async function fetchTemplate(id: string): Promise<PrescriptionTemplate> {
  const res = await api.get(`/prescriptions/templates/${id}`);
  return res.data.data;
}

export async function createTemplate(data: {
  name: string; nameBn: string; category: string;
  diagnosis?: string; advice?: string; instructions?: string;
  isShared?: boolean;
  items: TemplateItem[];
}): Promise<PrescriptionTemplate> {
  const res = await api.post("/prescriptions/templates", data);
  return res.data.data;
}

export async function updateTemplate(id: string, data: Partial<{
  name: string; nameBn: string; category: string;
  diagnosis?: string; advice?: string; instructions?: string;
  isShared?: boolean; items: TemplateItem[];
}>): Promise<PrescriptionTemplate> {
  const res = await api.put(`/prescriptions/templates/${id}`, data);
  return res.data.data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(`/prescriptions/templates/${id}`);
}
