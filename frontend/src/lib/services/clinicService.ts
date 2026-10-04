import api from "@/lib/api";
import {
  DoctorProfile, DoctorStats, QueueItem,
  ClinicPrescription, PrescriptionListResponse, AppointmentListResponse,
} from "@/types/clinic";
import { Patient, PatientListResponse } from "@/types/patient";

export async function fetchClinicMe(): Promise<DoctorProfile> {
  const res = await api.get("/clinic/me");
  return res.data.data;
}

export async function fetchClinicStats(): Promise<DoctorStats> {
  const res = await api.get("/clinic/stats");
  return res.data.data;
}

export async function fetchTodayQueue(): Promise<QueueItem[]> {
  const res = await api.get("/clinic/today");
  return res.data.data;
}

export async function fetchClinicAppointments(params: {
  status?: string; dateFrom?: string; dateTo?: string;
  page?: number; limit?: number;
} = {}): Promise<AppointmentListResponse> {
  const res = await api.get("/clinic/appointments", { params });
  return res.data.data;
}

export async function fetchClinicPatients(params: {
  search?: string; page?: number; limit?: number;
} = {}): Promise<PatientListResponse> {
  const res = await api.get("/clinic/patients", { params });
  return res.data.data;
}

export async function fetchClinicPrescriptions(params: {
  page?: number; limit?: number;
} = {}): Promise<PrescriptionListResponse> {
  const res = await api.get("/clinic/prescriptions", { params });
  return res.data.data;
}

export async function fetchClinicPrescription(rxId: string): Promise<ClinicPrescription> {
  const res = await api.get(`/clinic/prescriptions/${rxId}`);
  return res.data.data;
}

export async function createClinicVisit(patientId: string, data: {
  appointmentId?: string; visitDate?: string; chiefComplaint?: string;
  diagnosis?: string; treatment?: string; followUpDate?: string; notes?: string;
}) {
  const res = await api.post(`/clinic/patients/${patientId}/visits`, data);
  return res.data.data;
}

export async function createClinicPrescription(patientId: string, data: {
  visitId?: string; doctorId?: string; diagnosis?: string; instructions?: string;
  doctorNotes?: string; followUpDate?: string; followUpNote?: string;
  chiefComplaint?: string; history?: string; examNotes?: string; investigations?: string; advice?: string;
  vaRightEye?: string; vaLeftEye?: string; iopRightEye?: string; iopLeftEye?: string;
  refractionRE?: string; refractionLE?: string;
  items: { medicineName: string; dose?: string; frequency?: string; duration?: string; instructions?: string; sortOrder?: number }[];
}): Promise<ClinicPrescription> {
  const res = await api.post(`/clinic/patients/${patientId}/prescriptions`, data);
  return res.data.data;
}
