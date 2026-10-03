import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { Doctor, DoctorAdmin, DoctorListResponse, DoctorFilters } from "@/types/doctor";

// Public
export async function fetchDoctors(): Promise<Doctor[]> {
  const res = await api.get<ApiResponse<Doctor[]>>("/doctors");
  return res.data.data ?? [];
}

export async function fetchDoctorById(id: string): Promise<Doctor> {
  const res = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  if (!res.data.data) throw new Error("Doctor not found");
  return res.data.data;
}

// Admin
export async function fetchDoctorsAdmin(filters: DoctorFilters = {}): Promise<DoctorListResponse> {
  const res = await api.get<ApiResponse<DoctorListResponse>>("/doctors/admin/list", { params: filters });
  return res.data.data!;
}

export async function fetchDoctorAdmin(id: string): Promise<DoctorAdmin> {
  const res = await api.get<ApiResponse<DoctorAdmin>>(`/doctors/admin/${id}`);
  return res.data.data!;
}

export async function createDoctor(data: Partial<DoctorAdmin>): Promise<DoctorAdmin> {
  const res = await api.post<ApiResponse<DoctorAdmin>>("/doctors", data);
  return res.data.data!;
}

export async function updateDoctor(id: string, data: Partial<DoctorAdmin>): Promise<DoctorAdmin> {
  const res = await api.patch<ApiResponse<DoctorAdmin>>(`/doctors/${id}`, data);
  return res.data.data!;
}

export async function toggleDoctorStatus(id: string): Promise<DoctorAdmin> {
  const res = await api.patch<ApiResponse<DoctorAdmin>>(`/doctors/${id}/toggle`);
  return res.data.data!;
}

export async function assignDoctorAccount(id: string, data: { email: string; password: string }): Promise<DoctorAdmin> {
  const res = await api.post<ApiResponse<DoctorAdmin>>(`/doctors/${id}/assign-account`, data);
  return res.data.data!;
}
