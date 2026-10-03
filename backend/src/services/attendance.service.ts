import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CheckInInput, CheckOutInput } from "../validators/attendance.validator";
import { getSettings } from "./attendance.settings.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

/** Convert "HH:MM" hospital local time (UTC+6) to UTC Date for today */
function toUTC(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), h - 6, m));
}

function diffMinutes(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

const ATTENDANCE_SELECT = {
  id: true, userId: true, date: true, status: true,
  checkIn: true, checkInSelfie: true, checkInLatitude: true, checkInLongitude: true,
  checkOut: true, checkOutSelfie: true, checkOutLatitude: true, checkOutLongitude: true,
  lateMinutes: true, earlyCheckoutMinutes: true, workingMinutes: true,
  note: true, createdAt: true,
  user: {
    select: {
      id: true, name: true, role: true,
      employee: {
        select: {
          employeeId: true, nameBn: true, designationBn: true,
          department: { select: { id: true, name: true } },
          shift: { select: { startTime: true, endTime: true } },
        },
      },
      doctor: { select: { nameBn: true, designationBn: true } },
    },
  },
};

// ─── Self: Check-in ───────────────────────────────────────────────────────────

export async function checkIn(userId: string, input: CheckInInput) {
  const date = todayDate();
  const existing = await prisma.attendance.findUnique({ where: { userId_date: { userId, date } } });
  if (existing?.checkIn) throw new AppError("আজকের চেক-ইন ইতিমধ্যে সম্পন্ন হয়েছে।", 409);

  const now      = new Date(); // server time — never trust client
  const settings = await getSettings();

  // Determine effective start time: employee shift > office default
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { employee: { select: { shift: { select: { startTime: true, endTime: true } } } } },
  });
  const startTimeStr = user?.employee?.shift?.startTime ?? settings.officeStartTime;
  const expectedStart = toUTC(startTimeStr);

  const rawLate = diffMinutes(expectedStart, now);
  const effectiveLate = rawLate - settings.gracePeriodMinutes;
  const lateMinutes = effectiveLate > 0 ? effectiveLate : 0;
  const status: "PRESENT" | "LATE" = lateMinutes > 0 ? "LATE" : "PRESENT";

  const data = {
    checkIn: now,
    checkInSelfie: input.selfie || null,
    checkInLatitude: input.latitude ?? null,
    checkInLongitude: input.longitude ?? null,
    lateMinutes,
    status,
  };

  if (existing) {
    return prisma.attendance.update({ where: { id: existing.id }, data, select: ATTENDANCE_SELECT });
  }
  return prisma.attendance.create({
    data: { userId, date, ...data },
    select: ATTENDANCE_SELECT,
  });
}

// ─── Self: Check-out ──────────────────────────────────────────────────────────

export async function checkOut(userId: string, input: CheckOutInput) {
  const date   = todayDate();
  const record = await prisma.attendance.findUnique({ where: { userId_date: { userId, date } } });
  if (!record?.checkIn) throw new AppError("চেক-ইন না করে চেক-আউট করা যাবে না।", 400);
  if (record.checkOut)  throw new AppError("আজকের চেক-আউট ইতিমধ্যে সম্পন্ন হয়েছে।", 409);

  const now      = new Date();
  const settings = await getSettings();
  const workingMinutes = diffMinutes(record.checkIn, now);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { employee: { select: { shift: { select: { endTime: true } } } } },
  });
  const endTimeStr = user?.employee?.shift?.endTime ?? settings.officeEndTime;
  const expectedEnd = toUTC(endTimeStr);
  const rawEarly = diffMinutes(now, expectedEnd);
  const earlyCheckoutMinutes = rawEarly > settings.earlyCheckoutMinutes ? rawEarly : 0;

  return prisma.attendance.update({
    where: { id: record.id },
    data: {
      checkOut: now,
      checkOutSelfie: input.selfie || null,
      checkOutLatitude: input.latitude ?? null,
      checkOutLongitude: input.longitude ?? null,
      workingMinutes,
      earlyCheckoutMinutes,
    },
    select: ATTENDANCE_SELECT,
  });
}

// ─── Self: Today ──────────────────────────────────────────────────────────────

export async function getTodayAttendance(userId: string) {
  const date = todayDate();
  return prisma.attendance.findUnique({
    where: { userId_date: { userId, date } },
    select: ATTENDANCE_SELECT,
  });
}

// ─── Self: History ────────────────────────────────────────────────────────────

export async function getMyHistory(userId: string, page = 1, limit = 30) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.attendance.count({ where: { userId } }),
    prisma.attendance.findMany({
      where: { userId }, skip, take: limit,
      select: ATTENDANCE_SELECT,
      orderBy: { date: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Admin: List all ─────────────────────────────────────────────────────────

export async function listAttendances(query: {
  userId?: string; departmentId?: string;
  date?: string; dateFrom?: string; dateTo?: string;
  status?: string; page: number; limit: number;
}) {
  const where: any = {};
  if (query.userId) where.userId = query.userId;
  if (query.status) where.status = query.status;
  if (query.departmentId) {
    where.user = { employee: { departmentId: query.departmentId } };
  }
  if (query.date) {
    where.date = new Date(query.date);
  } else if (query.dateFrom || query.dateTo) {
    where.date = {};
    if (query.dateFrom) where.date.gte = new Date(query.dateFrom);
    if (query.dateTo)   where.date.lte = new Date(query.dateTo);
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.attendance.count({ where }),
    prisma.attendance.findMany({
      where, skip, take: query.limit,
      select: ATTENDANCE_SELECT,
      orderBy: [{ date: "desc" }, { checkIn: "desc" }],
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

// ─── Admin: Today summary ─────────────────────────────────────────────────────

export async function getTodaySummary() {
  const date = todayDate();
  const [present, late, absent, leave] = await Promise.all([
    prisma.attendance.count({ where: { date, status: "PRESENT" } }),
    prisma.attendance.count({ where: { date, status: "LATE" } }),
    prisma.attendance.count({ where: { date, status: "ABSENT" } }),
    prisma.attendance.count({ where: { date, status: "LEAVE" } }),
  ]);
  return { date, present, late, absent, leave, total: present + late + absent + leave };
}
