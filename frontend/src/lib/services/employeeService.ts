import api from "@/lib/api";
import { Employee, EmployeeListResponse, EmployeeFilters, Department, Shift } from "@/types/employee";

export async function fetchEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  const res = await api.get("/employees", { params: filters });
  return res.data.data;
}

export async function fetchEmployee(id: string): Promise<Employee> {
  const res = await api.get(`/employees/${id}`);
  return res.data.data;
}

export async function fetchMyEmployee(): Promise<Employee> {
  const res = await api.get("/employees/me");
  return res.data.data;
}

export async function createEmployee(data: Record<string, any>): Promise<Employee> {
  const res = await api.post("/employees", data);
  return res.data.data;
}

export async function updateEmployee(id: string, data: Record<string, any>): Promise<Employee> {
  const res = await api.patch(`/employees/${id}`, data);
  return res.data.data;
}

export async function toggleEmployeeStatus(id: string): Promise<Employee> {
  const res = await api.patch(`/employees/${id}/toggle-status`);
  return res.data.data;
}

export async function assignShift(id: string, shiftId: string): Promise<Employee> {
  const res = await api.patch(`/employees/${id}/shift`, { shiftId });
  return res.data.data;
}

export async function assignAccount(id: string, data: { email: string; password: string; role: string }): Promise<Employee> {
  const res = await api.post(`/employees/${id}/account`, data);
  return res.data.data;
}

export async function fetchDepartments(): Promise<Department[]> {
  const res = await api.get("/employees/departments");
  return res.data.data;
}

export async function fetchShifts(): Promise<Shift[]> {
  const res = await api.get("/employees/shifts");
  return res.data.data;
}
