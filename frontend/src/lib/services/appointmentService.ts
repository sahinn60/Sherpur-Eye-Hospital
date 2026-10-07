import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { Appointment, CreateAppointmentPayload } from "@/types/appointment";

export async function submitAppointment(
  payload: CreateAppointmentPayload
): Promise<Appointment> {
  const res = await api.post<ApiResponse<Appointment>>("/appointments", payload);
  if (!res.data.data) throw new Error("Failed to submit appointment");
  return res.data.data;
}

export async function trackAppointmentByRequestId(
  requestId: string
): Promise<Appointment> {
  const res = await api.get<ApiResponse<Appointment>>(
    `/appointments/track/${requestId}`
  );
  if (!res.data.data) throw new Error("Appointment not found");
  return res.data.data;
}

export async function updateAppointmentStatus(
  id: string,
  status: string,
  adminNote?: string
): Promise<Appointment> {
  const res = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, { status, adminNote });
  if (!res.data.data) throw new Error("Failed to update");
  return res.data.data;
}

export async function fetchAppointments(params: {
  status?: string; search?: string;
} = {}): Promise<Appointment[]> {
  const res = await api.get<ApiResponse<Appointment[]>>("/appointments", { params });
  return res.data.data || [];
}
