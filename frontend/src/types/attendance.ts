export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "HOLIDAY";

export interface AttendanceRecord {
  id:                   string;
  userId:               string;
  date:                 string;
  status:               AttendanceStatus;
  checkIn:              string | null;
  checkInSelfie:        string | null;
  checkInLatitude:      number | null;
  checkInLongitude:     number | null;
  checkOut:             string | null;
  checkOutSelfie:       string | null;
  checkOutLatitude:     number | null;
  checkOutLongitude:    number | null;
  lateMinutes:          number;
  earlyCheckoutMinutes: number;
  workingMinutes:       number;
  note:                 string | null;
  createdAt:            string;
  user: {
    id:   string;
    name: string;
    role: string;
    employee: {
      employeeId:    string;
      nameBn:        string;
      designationBn: string;
      department:    { id: string; name: string } | null;
      shift:         { startTime: string; endTime: string } | null;
    } | null;
    doctor: { nameBn: string; designationBn: string } | null;
  };
}

export interface AttendanceListResponse {
  items:      AttendanceRecord[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export interface TodaySummary {
  date:    string;
  present: number;
  late:    number;
  absent:  number;
  leave:   number;
  total:   number;
}

export interface AttendanceSettings {
  id:                   string;
  officeStartTime:      string;
  officeEndTime:        string;
  gracePeriodMinutes:   number;
  lateThresholdMinutes: number;
  earlyCheckoutMinutes: number;
  workingDays:          string[];
  weekends:             string[];
}

// ─── Report types ─────────────────────────────────────────────────────────────

export interface ReportSummary {
  present:             number;
  late:                number;
  absent:              number;
  leave:               number;
  holiday:             number;
  totalLateMinutes:    number;
  totalWorkingMinutes: number;
  totalDays:           number;
}

export interface ReportRow {
  id:             string;
  userId:         string;
  date:           string;
  status:         AttendanceStatus;
  checkIn:        string | null;
  checkOut:       string | null;
  lateMinutes:    number;
  earlyCheckoutMinutes: number;
  workingMinutes: number;
  user: {
    id: string; name: string; role: string;
    employee: {
      employeeId: string; nameBn: string; designationBn: string;
      department: { id: string; name: string } | null;
    } | null;
    doctor: { nameBn: string; designationBn: string } | null;
  };
}

export interface DailyReport {
  date:    string;
  rows:    ReportRow[];
  summary: ReportSummary;
}

export interface WeeklyReport {
  dateFrom: string;
  dateTo:   string;
  days:     { date: string; rows: ReportRow[]; summary: ReportSummary }[];
  summary:  ReportSummary;
}

export interface MonthlyReport {
  year:     number;
  month:    number;
  dateFrom: string;
  dateTo:   string;
  rows:     ReportRow[];
  summary:  ReportSummary;
}

export interface EmployeeReportEntry {
  userId:  string;
  name:    string;
  empId:   string;
  dept:    string;
  desig:   string;
  rows:    ReportRow[];
  summary: ReportSummary;
}

export interface EmployeeReport {
  dateFrom:  string;
  dateTo:    string;
  employees: EmployeeReportEntry[];
}

export interface DepartmentReportEntry {
  deptId:        string;
  name:          string;
  employeeCount: number;
  summary:       ReportSummary;
}

export interface DepartmentReport {
  dateFrom:    string;
  dateTo:      string;
  departments: DepartmentReportEntry[];
  summary:     ReportSummary;
}
