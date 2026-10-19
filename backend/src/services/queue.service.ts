import { prisma } from "../config/database";
import { AppError } from "../utils/response";

// ── helpers ──────────────────────────────────────────────────────────────────

function toBengaliDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
}

function todayDhaka(): Date {
  const now = new Date();
  const dhaka = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  dhaka.setHours(0, 0, 0, 0);
  return dhaka;
}

// ── PUBLIC ────────────────────────────────────────────────────────────────────

/** Active doctors that have at least one public session today */
export async function publicDoctorList() {
  const today = todayDhaka();
  const sessions = await prisma.queueSession.findMany({
    where: { sessionDate: today, isPublic: true, doctorId: { not: null } },
    select: { doctorId: true },
    distinct: ["doctorId"],
  });
  const doctorIds = sessions.map((s) => s.doctorId!).filter(Boolean);
  if (!doctorIds.length) return [];
  return prisma.doctor.findMany({
    where: { id: { in: doctorIds }, isActive: true },
    select: { id: true, nameBn: true, nameEn: true, designationBn: true, designationEn: true },
    orderBy: { sortOrder: "asc" },
  });
}

/** Public sessions for a doctor today */
export async function publicSessionsForDoctor(doctorId: string) {
  const today = todayDhaka();
  const sessions = await prisma.queueSession.findMany({
    where: { doctorId, sessionDate: today, isPublic: true },
    select: { id: true, roomLabel: true, status: true },
    orderBy: { createdAt: "asc" },
  });
  return sessions;
}

/** Safe public serial data — NO patient info */
export async function publicSerialData(sessionId: string) {
  const session = await prisma.queueSession.findUnique({
    where: { id: sessionId },
    select: {
      id: true, status: true, currentSerial: true, roomLabel: true, updatedAt: true,
      doctor: { select: { nameBn: true, nameEn: true } } as any,
    },
  });
  if (!session) throw new AppError("Session not found", 404);

  // Next waiting entries (actual queue, not currentSerial+1)
  const waiting = await prisma.queueEntry.findMany({
    where: { sessionId, status: "WAITING" },
    orderBy: { serial: "asc" },
    take: 2,
    select: { serial: true, tokenLabel: true },
  });

  return {
    sessionId: session.id,
    doctorNameBn: session.doctor?.nameBn ?? "",
    doctorNameEn: session.doctor?.nameEn ?? "",
    roomLabel: session.roomLabel,
    status: session.status,
    currentSerial: session.currentSerial ?? null,
    currentToken: session.currentSerial ? toBengaliDigits(session.currentSerial) : null,
    nextSerial: waiting[0]?.serial ?? null,
    nextToken: waiting[0] ? toBengaliDigits(waiting[0].serial) : null,
    afterNextSerial: waiting[1]?.serial ?? null,
    afterNextToken: waiting[1] ? toBengaliDigits(waiting[1].serial) : null,
    updatedAt: session.updatedAt,
  };
}

// ── STAFF — Session management ────────────────────────────────────────────────

export async function listSessionsForDoctor(doctorId: string, date?: string) {
  const d = date ? new Date(date) : todayDhaka();
  return prisma.queueSession.findMany({
    where: { doctorId, sessionDate: d },
    include: { _count: { select: { entries: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function listAllSessions(date?: string) {
  const d = date ? new Date(date) : todayDhaka();
  return prisma.queueSession.findMany({
    where: { sessionDate: d },
    include: {
      doctor: { select: { nameBn: true, nameEn: true } },
      _count: { select: { entries: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function createSession(data: {
  doctorId?: string; roomLabel: string; sessionDate?: string; isPublic?: boolean; createdBy: string;
}) {
  const d = data.sessionDate ? new Date(data.sessionDate) : todayDhaka();
  return prisma.queueSession.create({
    data: {
      doctorId: data.doctorId || null,
      roomLabel: data.roomLabel || "চেম্বার ১",
      sessionDate: d,
      isPublic: data.isPublic ?? true,
      createdBy: data.createdBy,
    },
  });
}

export async function updateSessionStatus(
  sessionId: string,
  action: "start" | "pause" | "resume" | "finish",
  requesterId: string,
  requesterRole: string
) {
  const session = await prisma.queueSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError("Session not found", 404);

  // Doctor can only manage own sessions
  if (requesterRole === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: requesterId } });
    if (!doctor || doctor.id !== session.doctorId) throw new AppError("Not authorized", 403);
  }

  const now = new Date();
  const updates: any = {};

  if (action === "start") {
    if (session.status !== "NOT_STARTED") throw new AppError("Session already started", 400);
    updates.status = "RUNNING";
    updates.startedAt = now;
  } else if (action === "pause") {
    if (session.status !== "RUNNING") throw new AppError("Session not running", 400);
    updates.status = "PAUSED";
    updates.pausedAt = now;
  } else if (action === "resume") {
    if (session.status !== "PAUSED") throw new AppError("Session not paused", 400);
    updates.status = "RUNNING";
  } else if (action === "finish") {
    updates.status = "FINISHED";
    updates.finishedAt = now;
  }

  return prisma.queueSession.update({ where: { id: sessionId }, data: updates });
}

export async function toggleSessionPublic(sessionId: string, isPublic: boolean) {
  return prisma.queueSession.update({ where: { id: sessionId }, data: { isPublic } });
}

// ── STAFF — Entry management ──────────────────────────────────────────────────

export async function getSessionEntries(sessionId: string) {
  return prisma.queueEntry.findMany({
    where: { sessionId },
    include: { patient: { select: { nameBn: true, nameEn: true, patientId: true, phone: true } } },
    orderBy: { serial: "asc" },
  });
}

export async function addEntry(data: {
  sessionId: string; patientId?: string; addedBy: string;
}) {
  const session = await prisma.queueSession.findUnique({ where: { id: data.sessionId } });
  if (!session) throw new AppError("Session not found", 404);
  if (session.status === "FINISHED") throw new AppError("Session is finished", 400);

  // Prevent duplicate active entry for same patient in same session
  if (data.patientId) {
    const existing = await prisma.queueEntry.findFirst({
      where: { sessionId: data.sessionId, patientId: data.patientId, status: { in: ["WAITING", "CALLED", "IN_CONSULTATION"] } },
    });
    if (existing) throw new AppError("Patient already in queue", 409);
  }

  // Next serial number
  const last = await prisma.queueEntry.findFirst({
    where: { sessionId: data.sessionId },
    orderBy: { serial: "desc" },
  });
  const serial = (last?.serial ?? 0) + 1;
  const tokenLabel = toBengaliDigits(serial);

  return prisma.queueEntry.create({
    data: {
      sessionId: data.sessionId,
      serial,
      tokenLabel,
      patientId: data.patientId ?? null,
      addedBy: data.addedBy,
    },
  });
}

/** Atomic call-next — uses transaction to prevent double-advance */
export async function callNext(sessionId: string, requesterId: string, requesterRole: string) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.queueSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new AppError("Session not found", 404);
    if (session.status !== "RUNNING") throw new AppError("Session not running", 400);

    if (requesterRole === "DOCTOR") {
      const doctor = await tx.doctor.findUnique({ where: { userId: requesterId } });
      if (!doctor || doctor.id !== session.doctorId) throw new AppError("Not authorized", 403);
    }

    // Mark current CALLED entry as IN_CONSULTATION if exists
    const current = await tx.queueEntry.findFirst({
      where: { sessionId, status: "CALLED" },
    });
    if (current) {
      await tx.queueEntry.update({ where: { id: current.id }, data: { status: "IN_CONSULTATION", startedAt: new Date() } });
    }

    // Get next WAITING entry
    const next = await tx.queueEntry.findFirst({
      where: { sessionId, status: "WAITING" },
      orderBy: { serial: "asc" },
    });
    if (!next) throw new AppError("No more waiting patients", 400);

    await tx.queueEntry.update({ where: { id: next.id }, data: { status: "CALLED", calledAt: new Date() } });
    await tx.queueSession.update({ where: { id: sessionId }, data: { currentSerial: next.serial } });

    return next;
  });
}

export async function completeEntry(entryId: string, requesterId: string, requesterRole: string) {
  const entry = await prisma.queueEntry.findUnique({ where: { id: entryId }, include: { session: true } });
  if (!entry) throw new AppError("Entry not found", 404);
  if (requesterRole === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: requesterId } });
    if (!doctor || doctor.id !== entry.session.doctorId) throw new AppError("Not authorized", 403);
  }
  return prisma.queueEntry.update({ where: { id: entryId }, data: { status: "COMPLETED", completedAt: new Date() } });
}

export async function skipEntry(entryId: string, reason: string, requesterId: string, requesterRole: string) {
  const entry = await prisma.queueEntry.findUnique({ where: { id: entryId }, include: { session: true } });
  if (!entry) throw new AppError("Entry not found", 404);
  if (requesterRole === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { userId: requesterId } });
    if (!doctor || doctor.id !== entry.session.doctorId) throw new AppError("Not authorized", 403);
  }
  return prisma.queueEntry.update({ where: { id: entryId }, data: { status: "SKIPPED", skippedAt: new Date(), skipReason: reason } });
}

export async function restoreEntry(entryId: string) {
  return prisma.queueEntry.update({ where: { id: entryId }, data: { status: "WAITING", skippedAt: null, skipReason: null } });
}
