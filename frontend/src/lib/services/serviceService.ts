import api from "@/lib/api";
import { ApiResponse } from "@/types";
import { Service } from "@/types/service";

export async function fetchServices(): Promise<Service[]> {
  const res = await api.get<ApiResponse<Service[]>>("/services");
  return res.data.data ?? [];
}

export async function fetchServiceById(id: string): Promise<Service> {
  const res = await api.get<ApiResponse<Service>>(`/services/${id}`);
  if (!res.data.data) throw new Error("Service not found");
  return res.data.data;
}
