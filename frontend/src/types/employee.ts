export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  nameBn: string;
  nameEn: string;
  photo: string | null;
  phone: string;
  email: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string | null;
  designationBn: string;
  designationEn: string;
  joiningDate: string;
  address: string | null;
  basicSalary: number;
  allowances: number;
  deductions: number;
  isActive: boolean;
  createdAt: string;
  department: Department | null;
  shift: Shift | null;
  user: {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string | null;
  } | null;
}

export interface EmployeeListResponse {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeFilters {
  search?: string;
  departmentId?: string;
  shiftId?: string;
  isActive?: string;
  page?: number;
  limit?: number;
}
