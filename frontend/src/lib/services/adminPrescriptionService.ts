import api from "@/lib/api";
import { DoctorPrescriptionSettings } from "./prescriptionService";

// ─── Hospital Rx Settings ─────────────────────────────────────────────────────

export interface HospitalRxSettings {
  rx_hospital_logo?:       string;
  rx_hospital_name_bn?:    string;
  rx_hospital_name_en?:    string;
  rx_hospital_address?:    string;
  rx_hospital_phone?:      string;
  rx_hospital_emergency?:  string;
  rx_hospital_email?:      string;
  rx_hospital_website?:    string;
  rx_header_text?:         string;
  rx_footer_text?:         string;
  rx_show_logo?:           string; // "true" | "false"
  rx_layout?:              string; // "standard" | "compact"
}

export async function fetchHospitalRxSettings(): Promise<HospitalRxSettings> {
  const res = await api.get("/prescriptions/admin/hospital-settings");
  return res.data.data;
}

export async function saveHospitalRxSettings(data: HospitalRxSettings): Promise<HospitalRxSettings> {
  const res = await api.post("/prescriptions/admin/hospital-settings", data);
  return res.data.data;
}

export async function uploadHospitalLogo(file: File): Promise<{ logoUrl: string }> {
  const fd = new FormData();
  fd.append("logo", file);
  const res = await api.post("/prescriptions/admin/hospital-settings/logo", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

// ─── Doctor Rx Settings (admin-managed) ──────────────────────────────────────

export interface DoctorWithSettings {
  id:            string;
  nameBn:        string;
  nameEn:        string;
  photo?:        string | null;
  designationBn: string;
  qualificationBn: string;
  phone?:        string | null;
  specialtyBn:   string;
  prescriptionSettings: DoctorPrescriptionSettings | null;
}

export async function fetchDoctorsWithSettings(): Promise<DoctorWithSettings[]> {
  const res = await api.get("/prescriptions/admin/doctors");
  return res.data.data;
}

export async function fetchDoctorRxSettings(doctorId: string): Promise<DoctorPrescriptionSettings | null> {
  const res = await api.get(`/prescriptions/admin/doctors/${doctorId}/settings`);
  return res.data.data;
}

export async function saveDoctorRxSettings(
  doctorId: string,
  data: Partial<DoctorPrescriptionSettings>
): Promise<DoctorPrescriptionSettings> {
  const res = await api.put(`/prescriptions/admin/doctors/${doctorId}/settings`, data);
  return res.data.data;
}

export async function uploadDoctorSignatureAdmin(doctorId: string, file: File): Promise<{ signatureUrl: string }> {
  const fd = new FormData();
  fd.append("signature", file);
  const res = await api.post(`/prescriptions/admin/doctors/${doctorId}/settings/signature`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function removeDoctorSignatureAdmin(doctorId: string): Promise<void> {
  await api.delete(`/prescriptions/admin/doctors/${doctorId}/settings/signature`);
}
