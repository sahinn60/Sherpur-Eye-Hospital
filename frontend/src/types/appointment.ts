export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface AppointmentDoctor {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface AppointmentService {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface Appointment {
  id: string;
  requestId: string;
  patientName: string;
  phone: string;
  email: string | null;
  age: number;
  gender: Gender;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  message: string | null;
  status: AppointmentStatus;
  adminNote: string | null;
  confirmedAt: string | null;
  createdAt: string;
  doctor: AppointmentDoctor | null;
  service: AppointmentService | null;
}

export interface CreateAppointmentPayload {
  patientName: string;
  phone: string;
  email?: string;
  age: number;
  gender: Gender;
  doctorId?: string;
  serviceId?: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  message?: string;
}
