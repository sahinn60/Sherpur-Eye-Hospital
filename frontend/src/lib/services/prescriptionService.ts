import api from "@/lib/api";

export interface DoctorPrescriptionSettings {
  id?: string;
  doctorId?: string;
  nameBn: string; nameEn: string;
  qualificationBn: string; qualificationEn: string;
  designationBn: string; designationEn: string;
  specialtyBn: string; specialtyEn: string;
  bmdcNo: string;
  chamberName: string; chamberAddress: string; chamberPhone: string;
  signatureUrl?: string | null;
  signatureMode: "uploaded" | "handwritten" | "none";
  preferredLang: "bn" | "en";
  showHeader: boolean; showFooter: boolean;
}

export interface RxItem {
  id?: string;
  medicineName: string;
  strength?: string;
  dosageForm?: string;
  route?: string;
  eye?: "RE" | "LE" | "BE" | null;
  dose?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  sortOrder?: number;
}

export interface SpectacleEye {
  sph?: string; cyl?: string; axis?: string; add?: string; pd?: string;
}

export interface SpectacleData {
  RE: SpectacleEye; LE: SpectacleEye;
  lensAdvice?: string; notes?: string;
}

export interface Prescription {
  id: string; rxNo: string;
  rxType: "clinical" | "spectacle";
  status: "DRAFT" | "FINALIZED";
  finalizedAt?: string | null;
  chiefComplaint?: string; history?: string; allergies?: string; currentMeds?: string;
  vaRightEye?: string; vaLeftEye?: string;
  refractionRE?: string; refractionLE?: string;
  iopRightEye?: string; iopLeftEye?: string;
  examNotes?: string;
  diagnosis?: string; investigations?: string; instructions?: string;
  advice?: string; doctorNotes?: string;
  followUpDate?: string | null; followUpNote?: string;
  spectacleData?: SpectacleData | null;
  doctorSnapshot?: DoctorPrescriptionSettings | null;
  createdAt: string; updatedAt: string;
  doctor?: {
    id: string; nameBn: string; nameEn: string;
    designationBn: string; qualificationBn: string; phone?: string;
    prescriptionSettings?: Partial<DoctorPrescriptionSettings> | null;
  } | null;
  patient?: {
    id: string; patientId: string; nameBn: string; nameEn: string;
    phone: string; age?: number | null; gender: string; address?: string | null;
  } | null;
  visit?: { id: string; visitDate: string; chiefComplaint?: string | null } | null;
  items: RxItem[];
  amendments?: { id: string; reason: string; amendedBy: string; createdAt: string }[];
}

const BASE = "/prescriptions";

export async function fetchRxSettings(): Promise<DoctorPrescriptionSettings | null> {
  const res = await api.get(`${BASE}/settings`);
  return res.data.data;
}

export async function saveRxSettings(data: Partial<DoctorPrescriptionSettings>): Promise<DoctorPrescriptionSettings> {
  const res = await api.post(`${BASE}/settings`, data);
  return res.data.data;
}

export async function uploadRxSignature(file: File): Promise<{ signatureUrl: string }> {
  const fd = new FormData();
  fd.append("signature", file);
  const res = await api.post(`${BASE}/settings/signature`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data.data;
}

export async function removeRxSignature(): Promise<void> {
  await api.delete(`${BASE}/settings/signature`);
}

export async function createRx(data: any): Promise<Prescription> {
  const res = await api.post(BASE, data);
  return res.data.data;
}

export async function updateRx(rxId: string, data: any): Promise<Prescription> {
  const res = await api.put(`${BASE}/${rxId}`, data);
  return res.data.data;
}

export async function finalizeRx(rxId: string): Promise<Prescription> {
  const res = await api.post(`${BASE}/${rxId}/finalize`);
  return res.data.data;
}

export async function amendRx(rxId: string, reason: string, data: any): Promise<Prescription> {
  const res = await api.post(`${BASE}/${rxId}/amend`, { reason, ...data });
  return res.data.data;
}

export async function fetchRx(rxId: string): Promise<Prescription> {
  const res = await api.get(`${BASE}/${rxId}`);
  return res.data.data;
}

export async function fetchRxList(params?: {
  patientId?: string; status?: string; rxType?: string; page?: number; limit?: number;
}): Promise<{ items: Prescription[]; total: number; totalPages: number; page: number }> {
  const res = await api.get(BASE, { params });
  return res.data.data;
}

export async function deleteRx(rxId: string): Promise<void> {
  await api.delete(`${BASE}/${rxId}`);
}
