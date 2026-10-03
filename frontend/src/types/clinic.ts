import { Gender } from "./patient";

export interface DoctorProfile {
  id:             string;
  nameBn:         string;
  nameEn:         string;
  photo:          string | null;
  designationBn:  string;
  qualificationBn: string;
  phone:          string | null;
  specialtyBn:    string;
  isActive:       boolean;
}

export interface DoctorStats {
  todayAppts:         number;
  totalPatients:      number;
  totalPrescriptions: number;
  pendingAppts:       number;
}

export interface QueuePatient {
  id:        string | null;
  patientId: string | null;
  phone:     string;
  nameBn:    string | null;
}

export interface QueueItem {
  id:            string;
  requestId:     string;
  patientName:   string;
  phone:         string;
  age:           number;
  gender:        Gender;
  preferredTime: string;
  reason:        string;
  status:        string;
  createdAt:     string;
  service:       { id: string; nameBn: string } | null;
  visit:         { id: string } | null;
  patient:       QueuePatient | null;
}

export interface ClinicAppointment {
  id:            string;
  requestId:     string;
  patientName:   string;
  phone:         string;
  age:           number;
  gender:        Gender;
  preferredDate: string;
  preferredTime: string;
  reason:        string;
  status:        string;
  adminNote:     string | null;
  createdAt:     string;
  service:       { id: string; nameBn: string } | null;
  visit:         { id: string } | null;
  patient:       QueuePatient | null;
}

export interface PrescriptionItem {
  id:           string;
  medicineName: string;
  dose:         string | null;
  frequency:    string | null;
  duration:     string | null;
  instructions: string | null;
  sortOrder:    number;
}

export interface ClinicPrescription {
  id:           string;
  diagnosis:    string | null;
  instructions: string | null;
  doctorNotes:  string | null;
  followUpDate: string | null;
  createdBy:    string | null;
  createdAt:    string;
  updatedAt:    string;
  doctor: {
    id: string; nameBn: string; nameEn: string;
    designationBn: string; qualificationBn: string; phone: string | null;
  } | null;
  visit:   { id: string; visitDate: string; chiefComplaint: string | null } | null;
  patient: {
    id: string; patientId: string; nameBn: string; nameEn: string;
    phone: string; age: number | null; gender: Gender; address: string | null;
  } | null;
  items: PrescriptionItem[];
}

export interface PrescriptionListResponse {
  items:      ClinicPrescription[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface AppointmentListResponse {
  items:      ClinicAppointment[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}
