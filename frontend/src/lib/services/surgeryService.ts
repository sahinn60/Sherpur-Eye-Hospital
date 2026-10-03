import api from "@/lib/api";

export type SurgeryStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface SurgeryPatient {
  id: string; patientId: string; nameBn: string; nameEn: string; phone: string; age: number | null; gender: string;
}
export interface SurgeryDoctor {
  id: string; nameBn: string; nameEn: string; designationBn: string;
}
export interface Surgery {
  id: string; surgeryNo: string; surgeryType: string;
  otDate: string; otTime: string; status: SurgeryStatus;
  preOpNotes: string | null; postOpNotes: string | null;
  followUpDate: string | null; anaesthesia: string | null;
  eye: string | null; notes: string | null;
  createdAt: string; updatedAt: string;
  patient: SurgeryPatient; doctor: SurgeryDoctor;
}
export interface SurgeryListResponse {
  items: Surgery[]; total: number; page: number; limit: number; totalPages: number;
}

export const SURGERY_STATUS_BN: Record<SurgeryStatus, string> = {
  SCHEDULED: "নির্ধারিত", CONFIRMED: "নিশ্চিত", COMPLETED: "সম্পন্ন", CANCELLED: "বাতিল",
};
export const SURGERY_STATUS_CLS: Record<SurgeryStatus, string> = {
  SCHEDULED: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export async function fetchSurgeries(params: {
  status?: string; doctorId?: string; dateFrom?: string; dateTo?: string;
  search?: string; page?: number; limit?: number;
} = {}): Promise<SurgeryListResponse> {
  return (await api.get("/surgery", { params })).data.data;
}

export async function createSurgery(data: {
  patientId: string; doctorId: string; surgeryType: string;
  otDate: string; otTime: string; status?: string;
  preOpNotes?: string; anaesthesia?: string; eye?: string; notes?: string;
}): Promise<Surgery> {
  return (await api.post("/surgery", data)).data.data;
}

export async function updateSurgery(id: string, data: Partial<{
  status: string; postOpNotes: string; followUpDate: string;
  preOpNotes: string; anaesthesia: string; eye: string; notes: string;
  otDate: string; otTime: string; surgeryType: string;
}>): Promise<Surgery> {
  return (await api.patch(`/surgery/${id}`, data)).data.data;
}

export async function deleteSurgery(id: string): Promise<void> {
  await api.delete(`/surgery/${id}`);
}
