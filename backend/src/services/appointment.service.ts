import { prisma } from "../config/database";
import { AppError } from "../utils/response";
import { CreateAppointmentInput, UpdateAppointmentStatusInput } from "../validators/appointment.validator";
import { notifyRoles, createNotification } from "./notification.service";
import { writeAudit, AuditContext } from "./audit.service";

const PUBLIC_SELECT = {
  id: true,
  requestId: true,
  patientName: true,
  phone: true,
  email: true,
  age: true,
  gender: true,
  preferredDate: true,
  preferredTime: true,
  reason: true,
  message: true,
  status: true,
  adminNote: true,
  confirmedAt: true,
  createdAt: true,
  doctor: { select: { id: true, nameBn: true, nameEn: true } },
  service: { select: { id: true, nameBn: true, nameEn: true } },
};

// Generate readable request ID: APT-YYYY-XXXX
async function generateRequestId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.appointment.count();
  const seq = String(count + 1).padStart(4, "0");
  return `APT-${year}-${seq}`;
}

export async function createAppointment(input: CreateAppointmentInput, ctx?: AuditContext) {
  const requestId = await generateRequestId();

  const appt = await prisma.appointment.create({
    data: {
      requestId,
      patientName:   input.patientName,
      phone:         input.phone,
      email:         input.email || null,
      age:           input.age,
      gender:        input.gender,
      doctorId:      input.doctorId || null,
      serviceId:     input.serviceId || null,
      preferredDate: new Date(input.preferredDate),
      preferredTime: input.preferredTime,
      reason:        input.reason,
      message:       input.message || null,
      status:        "PENDING",
    },
    select: PUBLIC_SELECT,
  });

  // Notify admins/reception of new appointment
  notifyRoles({
    roles:   ["SUPER_ADMIN", "ADMIN", "RECEPTION"],
    type:    "APPOINTMENT_NEW",
    titleBn: "নতুন অ্যাপয়েন্টমেন্ট",
    bodyBn:  `${input.patientName} (${input.phone}) অ্যাপয়েন্টমেন্ট নিয়েছেন।`,
    refId:   appt.id,
    refType: "appointment",
  }).catch(() => {});

  if (ctx) writeAudit({ ctx, action: "CREATE", module: "appointment", recordId: appt.id, recordLabel: `${requestId} — ${input.patientName}` });

  return appt;
}

export async function getAllAppointments(status?: string) {
  return prisma.appointment.findMany({
    where: status ? { status: status as any } : undefined,
    select: PUBLIC_SELECT,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

export async function getAppointmentById(id: string) {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    select: PUBLIC_SELECT,
  });
  if (!appt) throw new AppError("Appointment not found", 404);
  return appt;
}

export async function getAppointmentByRequestId(requestId: string) {
  const appt = await prisma.appointment.findUnique({
    where: { requestId },
    select: PUBLIC_SELECT,
  });
  if (!appt) throw new AppError("Appointment not found", 404);
  return appt;
}

export async function updateAppointmentStatus(
  id: string,
  input: UpdateAppointmentStatusInput,
  confirmedBy?: string,
  ctx?: AuditContext
) {
  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError("Appointment not found", 404);

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status:    input.status,
      adminNote: input.adminNote,
      ...(input.status === "CONFIRMED" ? { confirmedAt: new Date(), confirmedBy } : {}),
    },
    select: PUBLIC_SELECT,
  });

  // Notify relevant staff on status change
  const statusNotifMap: Record<string, { type: any; titleBn: string; roles: string[] }> = {
    CONFIRMED:  { type: "APPOINTMENT_CONFIRMED",  titleBn: "অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে", roles: ["SUPER_ADMIN", "ADMIN", "RECEPTION"] },
    CANCELLED:  { type: "APPOINTMENT_CANCELLED",  titleBn: "অ্যাপয়েন্টমেন্ট বাতিল হয়েছে",   roles: ["SUPER_ADMIN", "ADMIN", "RECEPTION"] },
  };
  const notif = statusNotifMap[input.status];
  if (notif) {
    notifyRoles({
      roles:   notif.roles,
      type:    notif.type,
      titleBn: notif.titleBn,
      bodyBn:  `${existing.patientName} (${existing.requestId})`,
      refId:   id,
      refType: "appointment",
    }).catch(() => {});
  }

  if (ctx) writeAudit({ ctx, action: "STATUS_CHANGE", module: "appointment", recordId: id, recordLabel: `${existing.requestId} → ${input.status}` });

  return updated;
}
