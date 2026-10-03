import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { ApplyLeaveInput, ReviewLeaveInput } from "../validators/leave.validator";
import { createNotification } from "./notification.service";
import { writeAudit, AuditContext } from "./audit.service";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEAVE_SELECT = {
  id: true, leaveType: true, startDate: true, endDate: true,
  totalDays: true, reason: true, attachment: true,
  status: true, reviewNote: true, reviewedAt: true, createdAt: true, updatedAt: true,
  user: {
    select: {
      id: true, name: true, role: true,
      employee: { select: { employeeId: true, nameBn: true, designationBn: true,
        department: { select: { id: true, name: true } } } },
      doctor: { select: { nameBn: true, designationBn: true } },
    },
  },
  reviewer: { select: { id: true, name: true, role: true } },
};

const LEAVE_TYPE_BN: Record<string, string> = {
  CASUAL: "নৈমিত্তিক ছুটি", SICK: "অসুস্থতাজনিত ছুটি", ANNUAL: "বার্ষিক ছুটি",
  MATERNITY: "মাতৃত্বকালীন ছুটি", PATERNITY: "পিতৃত্বকালীন ছুটি",
  UNPAID: "বেতনহীন ছুটি", EMERGENCY: "জরুরি ছুটি", OTHER: "অন্যান্য ছুটি",
};

/** Count working days between two dates (inclusive), skipping Fridays */
function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (cur.getDay() !== 5) count++; // 5 = Friday
    cur.setDate(cur.getDate() + 1);
  }
  return Math.max(1, count);
}

/** Enumerate all dates between start and end inclusive */
function* eachDay(start: Date, end: Date) {
  const cur = new Date(start);
  while (cur <= end) {
    yield new Date(cur);
    cur.setDate(cur.getDate() + 1);
  }
}

// ─── Apply ────────────────────────────────────────────────────────────────────

export async function applyLeave(userId: string, input: ApplyLeaveInput, ctx?: AuditContext) {
  const start = new Date(input.startDate);
  const end   = new Date(input.endDate);
  if (end < start) throw new AppError("শেষ তারিখ শুরুর তারিখের আগে হতে পারে না।", 400);

  const totalDays = countWorkingDays(start, end);

  const overlap = await prisma.leaveRequest.findFirst({
    where: {
      userId,
      status: { in: ["PENDING", "APPROVED"] },
      OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
    },
  });
  if (overlap) throw new AppError("এই তারিখে ইতিমধ্যে একটি ছুটির আবেদন আছে।", 409);

  const leave = await prisma.leaveRequest.create({
    data: {
      userId,
      leaveType:  input.leaveType as any,
      startDate:  start,
      endDate:    end,
      totalDays,
      reason:     input.reason,
      attachment: input.attachment || null,
    },
    select: LEAVE_SELECT,
  });

  const managers = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN", "HR"] }, isActive: true },
    select: { id: true },
  });
  const applicantName = leave.user.employee?.nameBn || leave.user.doctor?.nameBn || leave.user.name;
  await Promise.all(managers.map((m) =>
    createNotification({
      userId:  m.id,
      type:    "LEAVE_APPLIED",
      titleBn: "নতুন ছুটির আবেদন",
      bodyBn:  `${applicantName} ${totalDays} দিনের ${LEAVE_TYPE_BN[input.leaveType] || "ছুটি"} আবেদন করেছেন।`,
      refId:   leave.id,
      refType: "leave",
    })
  ));

  if (ctx) writeAudit({ ctx, action: "CREATE", module: "leave", recordId: leave.id, recordLabel: `${LEAVE_TYPE_BN[input.leaveType]} — ${totalDays} দিন` });

  return leave;
}

// ─── List (self) ──────────────────────────────────────────────────────────────

export async function getMyLeaves(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items] = await Promise.all([
    prisma.leaveRequest.count({ where: { userId } }),
    prisma.leaveRequest.findMany({
      where: { userId }, skip, take: limit,
      select: LEAVE_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── List (admin) ─────────────────────────────────────────────────────────────

export async function listLeaves(query: {
  status?: string; userId?: string; departmentId?: string;
  dateFrom?: string; dateTo?: string;
  page: number; limit: number;
}) {
  const where: any = {};
  if (query.status)   where.status = query.status;
  if (query.userId)   where.userId = query.userId;
  if (query.dateFrom || query.dateTo) {
    where.startDate = {};
    if (query.dateFrom) where.startDate.gte = new Date(query.dateFrom);
    if (query.dateTo)   where.startDate.lte = new Date(query.dateTo);
  }
  if (query.departmentId) {
    where.user = { employee: { departmentId: query.departmentId } };
  }

  const skip = (query.page - 1) * query.limit;
  const [total, items] = await Promise.all([
    prisma.leaveRequest.count({ where }),
    prisma.leaveRequest.findMany({
      where, skip, take: query.limit,
      select: LEAVE_SELECT,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  return { items, total, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
}

// ─── Review (approve / reject) ────────────────────────────────────────────────

export async function reviewLeave(leaveId: string, reviewerId: string, input: ReviewLeaveInput, ctx?: AuditContext) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId }, select: LEAVE_SELECT });
  if (!leave)                    throw new AppError("ছুটির আবেদন পাওয়া যায়নি।", 404);
  if (leave.status !== "PENDING") throw new AppError("শুধুমাত্র অপেক্ষমাণ আবেদন পর্যালোচনা করা যাবে।", 400);

  const updated = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: {
      status:     input.status as any,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      reviewNote: input.reviewNote || null,
    },
    select: LEAVE_SELECT,
  });

  if (input.status === "APPROVED") {
    const start = new Date(leave.startDate);
    const end   = new Date(leave.endDate);
    for (const day of eachDay(start, end)) {
      const dateUTC = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
      await prisma.attendance.upsert({
        where:  { userId_date: { userId: leave.user.id, date: dateUTC } },
        update: { status: "LEAVE", note: `ছুটি অনুমোদিত: ${leave.id}` },
        create: { userId: leave.user.id, date: dateUTC, status: "LEAVE", note: `ছুটি অনুমোদিত: ${leave.id}` },
      });
    }
  }

  const isApproved = input.status === "APPROVED";
  await createNotification({
    userId:  leave.user.id,
    type:    isApproved ? "LEAVE_APPROVED" : "LEAVE_REJECTED",
    titleBn: isApproved ? "ছুটি অনুমোদিত হয়েছে ✅" : "ছুটি প্রত্যাখ্যাত হয়েছে ❌",
    bodyBn:  isApproved
      ? `আপনার ${leave.totalDays} দিনের ${LEAVE_TYPE_BN[leave.leaveType] || "ছুটি"} অনুমোদিত হয়েছে।`
      : `আপনার ছুটির আবেদন প্রত্যাখ্যাত হয়েছে।${input.reviewNote ? ` কারণ: ${input.reviewNote}` : ""}`,
    refId:   leaveId,
    refType: "leave",
  });

  if (ctx) writeAudit({ ctx, action: "STATUS_CHANGE", module: "leave", recordId: leaveId, recordLabel: `${leave.user.name} → ${input.status}` });

  return updated;
}

// ─── Cancel (self) ────────────────────────────────────────────────────────────

export async function cancelLeave(leaveId: string, userId: string) {
  const leave = await prisma.leaveRequest.findUnique({ where: { id: leaveId } });
  if (!leave)              throw new AppError("ছুটির আবেদন পাওয়া যায়নি।", 404);
  if (leave.userId !== userId) throw new AppError("এই আবেদন বাতিল করার অনুমতি নেই।", 403);
  if (leave.status === "APPROVED") throw new AppError("অনুমোদিত ছুটি বাতিল করতে HR-এর সাথে যোগাযোগ করুন।", 400);
  if (leave.status === "CANCELLED") throw new AppError("আবেদনটি ইতিমধ্যে বাতিল করা হয়েছে।", 400);

  const updated = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data:  { status: "CANCELLED" },
    select: LEAVE_SELECT,
  });

  // Notify managers
  const managers = await prisma.user.findMany({
    where: { role: { in: ["SUPER_ADMIN", "ADMIN", "HR"] }, isActive: true },
    select: { id: true },
  });
  const name = leave.userId;
  await Promise.all(managers.map((m) =>
    createNotification({
      userId:  m.id,
      type:    "LEAVE_CANCELLED",
      titleBn: "ছুটির আবেদন বাতিল",
      bodyBn:  `একটি ছুটির আবেদন বাতিল করা হয়েছে।`,
      refId:   leaveId,
      refType: "leave",
    })
  ));

  return updated;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getLeaveSummary(userId: string) {
  const year = new Date().getFullYear();
  const start = new Date(`${year}-01-01`);
  const end   = new Date(`${year}-12-31`);

  const [pending, approved, rejected, cancelled] = await Promise.all([
    prisma.leaveRequest.count({ where: { userId, status: "PENDING" } }),
    prisma.leaveRequest.count({ where: { userId, status: "APPROVED", startDate: { gte: start, lte: end } } }),
    prisma.leaveRequest.count({ where: { userId, status: "REJECTED" } }),
    prisma.leaveRequest.count({ where: { userId, status: "CANCELLED" } }),
  ]);

  const approvedDays = await prisma.leaveRequest.aggregate({
    where: { userId, status: "APPROVED", startDate: { gte: start, lte: end } },
    _sum: { totalDays: true },
  });

  return {
    pending, approved, rejected, cancelled,
    totalApprovedDays: approvedDays._sum.totalDays || 0,
  };
}
