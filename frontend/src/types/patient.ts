export type Gender = "MALE" | "FEMALE" | "OTHER";

export const GENDER_BN: Record<Gender, string> = {
  MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য",
};

export interface Medicine {
  name:      string;
  dose?:     string;
  frequency?: string;
  duration?: string;
}

export interface Visit {
  id:             string;
  visitDate:      string;
  chiefComplaint: string | null;
  diagnosis:      string | null;
  treatment:      string | null;
  followUpDate:   string | null;
  notes:          string | null;
  createdBy:      string | null;
  createdAt:      string;
  updatedAt:      string;
  doctor: { id: string; nameBn: string; nameEn: string; designationBn: string } | null;
  prescriptions:  { id: string; medicines: Medicine[]; instructions: string | null; followUpDate: string | null; createdAt: string }[];
}

export interface Prescription {
  id:           string;
  medicines:    Medicine[];
  instructions: string | null;
  followUpDate: string | null;
  createdBy:    string | null;
  createdAt:    string;
  updatedAt:    string;
  doctor: { id: string; nameBn: string; nameEn: string; designationBn: string } | null;
  visit:  { id: string; visitDate: string; chiefComplaint: string | null } | null;
}

export interface PatientAppointment {
  id:            string;
  requestId:     string;
  patientName:   string;
  phone:         string;
  preferredDate: string;
  preferredTime: string;
  reason:        string;
  status:        string;
  adminNote:     string | null;
  confirmedAt:   string | null;
  createdAt:     string;
  doctor:  { id: string; nameBn: string; designationBn: string } | null;
  service: { id: string; nameBn: string } | null;
}

export interface Patient {
  id:               string;
  patientId:        string;
  nameBn:           string;
  nameEn:           string;
  phone:            string;
  email:            string | null;
  age:              number | null;
  gender:           Gender;
  address:          string | null;
  emergencyContact: string | null;
  medicalHistory:   string | null;
  notes:            string | null;
  registeredBy:     string | null;
  isActive:         boolean;
  createdAt:        string;
  updatedAt:        string;
  _count:           { visits: number; prescriptions: number };
}

export interface PatientDetail extends Patient {
  visits:        Visit[];
  prescriptions: Prescription[];
}

export interface PatientListResponse {
  items:      Patient[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface VisitListResponse {
  items:      Visit[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface PrescriptionListResponse {
  items:      Prescription[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface AppointmentListResponse {
  items:      PatientAppointment[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}
