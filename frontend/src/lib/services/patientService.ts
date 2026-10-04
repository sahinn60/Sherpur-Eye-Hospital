import api from "@/lib/api";
import {
  Patient, PatientDetail, PatientListResponse,
  VisitListResponse, PrescriptionListResponse, AppointmentListResponse,
} from "@/types/patient";

// ─── Patients ─────────────────────────────────────────────────────────────────

export async function fetchPatients(params: {
  search?: string; gender?: string; isActive?: string;
  page?: number; limit?: number;
} = {}): Promise<PatientListResponse> {
  const res = await api.get("/patients", { params });
  return res.data.data;
}

export async function fetchPatient(id: string): Promise<PatientDetail> {
  const res = await api.get(`/patients/${id}`);
  return res.data.data;
}

export async function createPatient(data: {
  nameBn: string; nameEn: string; phone: string; email?: string;
  age?: number; gender: string; address?: string;
  emergencyContact?: string; medicalHistory?: string; notes?: string;
}): Promise<Patient> {
  const res = await api.post("/patients", data);
  return res.data.data;
}

export async function updatePatient(id: string, data: Partial<{
  nameBn: string; nameEn: string; phone: string; email: string;
  age: number; gender: string; address: string;
  emergencyContact: string; medicalHistory: string; notes: string;
}>): Promise<Patient> {
  const res = await api.patch(`/patients/${id}`, data);
  return res.data.data;
}

export async function togglePatientStatus(id: string): Promise<Patient> {
  const res = await api.patch(`/patients/${id}/toggle`);
  return res.data.data;
}

// ─── Visits ───────────────────────────────────────────────────────────────────

export async function fetchPatientVisits(patientId: string, page = 1, limit = 20): Promise<VisitListResponse> {
  const res = await api.get(`/patients/${patientId}/visits`, { params: { page, limit } });
  return res.data.data;
}

export async function createVisit(patientId: string, data: {
  visitDate?: string; chiefComplaint?: string; diagnosis?: string;
  treatment?: string; doctorId?: string; followUpDate?: string; notes?: string;
}) {
  const res = await api.post(`/patients/${patientId}/visits`, data);
  return res.data.data;
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export async function fetchPatientPrescriptions(patientId: string, page = 1, limit = 20): Promise<PrescriptionListResponse> {
  const res = await api.get(`/patients/${patientId}/prescriptions`, { params: { page, limit } });
  return res.data.data;
}

export async function createPrescription(patientId: string, data: {
  visitId?: string; doctorId?: string; diagnosis?: string;
  instructions?: string; advice?: string; followUpDate?: string; followUpNote?: string;
  items: { medicineName: string; dose?: string; frequency?: string; duration?: string; instructions?: string }[];
}) {
  const res = await api.post(`/patients/${patientId}/prescriptions`, data);
  return res.data.data;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export async function fetchPatientAppointments(patientId: string, page = 1, limit = 20): Promise<AppointmentListResponse> {
  const res = await api.get(`/patients/${patientId}/appointments`, { params: { page, limit } });
  return res.data.data;
}
