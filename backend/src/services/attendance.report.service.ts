import { prisma } from "../config/database";

// ─── Shared select ────────────────────────────────────────────────────────────

const BASE_SELECT = {
  id: true, userId: true, date: true, status: true,
  checkIn: true, checkOut: true,
  lateMinutes: true, earlyCheckoutMinutes: true, workingMinutes: true,
  user: {
    select: {
      id: true, name: true, role: true,
      employee: {
        select: {
          employeeId: true, nameBn: true, designationBn: true,
          department: { select: { id: true, name: true } },
        },
      },
      doctor: { select: { nameBn: true, designationBn: true } },
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWhere(params: {
  dateFrom: string; dateTo: string;
  userId?: string; departmentId?: string; status?: string;
}) {
  const where: any = {
    date: { gte: new Date(params.dateFrom), lte: new Date(params.dateTo) },
  };
  if (params.userId)       where.userId = params.userId;
  if (params.status)       where.status = params.status;
  if (params.departmentId) where.user   = { employee: { departmentId: params.departmentId } };
  return where;
}

function summariseRows(rows: any[]) {
  return {
    present:          rows.filter((r) => r.status === "PRESENT").length,
    late:             rows.filter((r) => r.status === "LATE").length,
    absent:           rows.filter((r) => r.status === "ABSENT").length,
    leave:            rows.filter((r) => r.status === "LEAVE").length,
    holiday:          rows.filter((r) => r.status === "HOLIDAY").length,
    totalLateMinutes: rows.reduce((s, r) => s + (r.lateMinutes || 0), 0),
    totalWorkingMinutes: rows.reduce((s, r) => s + (r.workingMinutes || 0), 0),
    totalDays:        rows.length,
  };
}

// ─── Daily report ─────────────────────────────────────────────────────────────

export async function getDailyReport(params: {
  date: string; departmentId?: string; status?: string;
}) {
  const where = buildWhere({ dateFrom: params.date, dateTo: params.date, ...params });
  const rows  = await prisma.attendance.findMany({
    where, select: BASE_SELECT, orderBy: { checkIn: "asc" },
  });
  return { date: params.date, rows, summary: summariseRows(rows) };
}

// ─── Weekly report ────────────────────────────────────────────────────────────

export async function getWeeklyReport(params: {
  dateFrom: string; dateTo: string; departmentId?: string;
}) {
  const where = buildWhere(params);
  const rows  = await prisma.attendance.findMany({
    where, select: BASE_SELECT, orderBy: [{ date: "asc" }, { checkIn: "asc" }],
  });

  // Group by date
  const byDate: Record<string, any[]> = {};
  for (const r of rows) {
    const key = r.date.toISOString().split("T")[0];
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(r);
  }

  const days = Object.entries(byDate).map(([date, dayRows]) => ({
    date,
    rows: dayRows,
    summary: summariseRows(dayRows),
  }));

  return { dateFrom: params.dateFrom, dateTo: params.dateTo, days, summary: summariseRows(rows) };
}

// ─── Monthly report ───────────────────────────────────────────────────────────

export async function getMonthlyReport(params: {
  year: number; month: number; departmentId?: string;
}) {
  const dateFrom = `${params.year}-${String(params.month).padStart(2, "0")}-01`;
  const lastDay  = new Date(params.year, params.month, 0).getDate();
  const dateTo   = `${params.year}-${String(params.month).padStart(2, "0")}-${lastDay}`;

  const where = buildWhere({ dateFrom, dateTo, departmentId: params.departmentId });
  const rows  = await prisma.attendance.findMany({
    where, select: BASE_SELECT, orderBy: [{ date: "asc" }],
  });

  return {
    year: params.year, month: params.month,
    dateFrom, dateTo,
    rows,
    summary: summariseRows(rows),
  };
}

// ─── Employee-wise report ─────────────────────────────────────────────────────

export async function getEmployeeReport(params: {
  dateFrom: string; dateTo: string;
  userId?: string; departmentId?: string;
}) {
  const where = buildWhere(params);
  const rows  = await prisma.attendance.findMany({
    where, select: BASE_SELECT, orderBy: [{ userId: "asc" }, { date: "asc" }],
  });

  // Group by userId
  const byUser: Record<string, any[]> = {};
  for (const r of rows) {
    if (!byUser[r.userId]) byUser[r.userId] = [];
    byUser[r.userId].push(r);
  }

  const employees = Object.entries(byUser).map(([userId, empRows]) => {
    const first = empRows[0];
    const name  = first.user.employee?.nameBn || first.user.doctor?.nameBn || first.user.name;
    const empId = first.user.employee?.employeeId || "—";
    const dept  = first.user.employee?.department?.name || "—";
    const desig = first.user.employee?.designationBn || first.user.doctor?.designationBn || "—";
    return {
      userId, name, empId, dept, desig,
      rows: empRows,
      summary: summariseRows(empRows),
    };
  });

  return { dateFrom: params.dateFrom, dateTo: params.dateTo, employees };
}

// ─── Department-wise report ───────────────────────────────────────────────────

export async function getDepartmentReport(params: {
  dateFrom: string; dateTo: string;
}) {
  const where = buildWhere(params);
  const rows  = await prisma.attendance.findMany({
    where, select: BASE_SELECT, orderBy: [{ date: "asc" }],
  });

  // Group by department
  const byDept: Record<string, { name: string; rows: any[] }> = {};
  for (const r of rows) {
    const deptId   = r.user.employee?.department?.id   || "no-dept";
    const deptName = r.user.employee?.department?.name || "বিভাগ নেই";
    if (!byDept[deptId]) byDept[deptId] = { name: deptName, rows: [] };
    byDept[deptId].rows.push(r);
  }

  const departments = Object.entries(byDept).map(([deptId, { name, rows: deptRows }]) => ({
    deptId, name,
    summary: summariseRows(deptRows),
    employeeCount: new Set(deptRows.map((r) => r.userId)).size,
  }));

  return { dateFrom: params.dateFrom, dateTo: params.dateTo, departments, summary: summariseRows(rows) };
}
