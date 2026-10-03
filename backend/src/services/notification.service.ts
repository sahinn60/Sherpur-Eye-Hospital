import { prisma } from "../config/database";

export type NType =
  | "LEAVE_APPLIED" | "LEAVE_APPROVED" | "LEAVE_REJECTED" | "LEAVE_CANCELLED"
  | "APPOINTMENT_NEW" | "APPOINTMENT_CONFIRMED" | "APPOINTMENT_CANCELLED"
  | "ATTENDANCE_LATE" | "ATTENDANCE_ABSENT"
  | "HOSPITAL_NOTICE" | "SYSTEM" | "GENERAL";

export async function createNotification(params: {
  userId:   string;
  type:     NType;
  titleBn:  string;
  bodyBn:   string;
  refId?:   string;
  refType?: string;
}) {
  return prisma.notification.create({
    data: {
      userId:  params.userId,
      type:    params.type as any,
      titleBn: params.titleBn,
      bodyBn:  params.bodyBn,
      refId:   params.refId   || null,
      refType: params.refType || null,
    },
  });
}

/** Notify multiple users at once (fire-and-forget) */
export async function broadcastNotification(params: {
  userIds:  string[];
  type:     NType;
  titleBn:  string;
  bodyBn:   string;
  refId?:   string;
  refType?: string;
}) {
  if (!params.userIds.length) return;
  await prisma.notification.createMany({
    data: params.userIds.map((userId) => ({
      userId,
      type:    params.type as any,
      titleBn: params.titleBn,
      bodyBn:  params.bodyBn,
      refId:   params.refId   || null,
      refType: params.refType || null,
    })),
    skipDuplicates: true,
  });
}

/** Notify all users with given roles */
export async function notifyRoles(params: {
  roles:    string[];
  type:     NType;
  titleBn:  string;
  bodyBn:   string;
  refId?:   string;
  refType?: string;
}) {
  const users = await prisma.user.findMany({
    where: { role: { in: params.roles as any[] }, isActive: true },
    select: { id: true },
  });
  await broadcastNotification({ ...params, userIds: users.map((u) => u.id) });
}

/** Broadcast a hospital-wide notice to ALL active users */
export async function broadcastHospitalNotice(params: {
  titleBn: string;
  bodyBn:  string;
  refId?:  string;
}) {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  });
  await broadcastNotification({
    userIds: users.map((u) => u.id),
    type:    "HOSPITAL_NOTICE",
    titleBn: params.titleBn,
    bodyBn:  params.bodyBn,
    refId:   params.refId,
    refType: "notice",
  });
}

export async function getMyNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [total, items, unreadCount] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.findMany({
      where: { userId }, skip, take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);
  return { items, total, unreadCount, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function markRead(userId: string, notificationId?: string) {
  if (notificationId) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data:  { isRead: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    });
  }
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, isRead: false } });
}
