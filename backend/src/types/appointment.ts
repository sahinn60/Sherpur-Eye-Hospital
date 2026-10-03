export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface AppointmentPublic {
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
  createdAt: string;
  doctor: { id: string; nameBn: string; nameEn: string } | null;
  service: { id: string; nameBn: string; nameEn: string } | null;
}
