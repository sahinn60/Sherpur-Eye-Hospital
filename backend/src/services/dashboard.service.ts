import { prisma } from "../config/database";

function startOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function endOfDay(d: Date) {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function getDashboardStats() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);

  const [
    totalPatients,
    totalDoctors,
    totalEmployees,
    todayAppointments,
    pendingAppointments,
    presentToday,
    absentToday,
    lateToday,
    monthlyAppointments,
  ] = await Promise.all([
    prisma.patient.count({ where: { isActive: true } }),
    prisma.doctor.count({ where: { isActive: true } }),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.appointment.count({
      where: { preferredDate: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.attendance.count({
      where: { date: { gte: todayStart, lte: todayEnd }, status: "PRESENT" },
    }),
    prisma.attendance.count({
      where: { date: { gte: todayStart, lte: todayEnd }, status: "ABSENT" },
    }),
    prisma.attendance.count({
      where: { date: { gte: todayStart, lte: todayEnd }, status: "LATE" },
    }),
    // Last 7 days appointment counts
    prisma.$queryRaw<{ date: Date; count: bigint }[]>`
      SELECT DATE("preferredDate") as date, COUNT(*) as count
      FROM appointments
      WHERE "preferredDate" >= ${new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)}
      GROUP BY DATE("preferredDate")
      ORDER BY date ASC
    `,
  ]);

  // Recent appointments
  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      requestId: true,
      patientName: true,
      preferredDate: true,
      preferredTime: true,
      status: true,
      doctor: { select: { nameBn: true, nameEn: true } },
    },
  });

  // Appointment status breakdown
  const statusBreakdown = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  // Monthly appointment trend (last 6 months)
  const monthlyTrend = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
    SELECT TO_CHAR("preferredDate", 'YYYY-MM') as month, COUNT(*) as count
    FROM appointments
    WHERE "preferredDate" >= ${new Date(now.getFullYear(), now.getMonth() - 5, 1)}
    GROUP BY TO_CHAR("preferredDate", 'YYYY-MM')
    ORDER BY month ASC
  `;

  return {
    cards: {
      totalPatients,
      totalDoctors,
      totalEmployees,
      todayAppointments,
      pendingAppointments,
      presentToday,
      absentToday,
      lateToday,
    },
    recentAppointments,
    statusBreakdown: statusBreakdown.map((s) => ({
      status: s.status,
      count: s._count.status,
    })),
    weeklyAppointments: monthlyAppointments.map((r) => ({
      date: r.date.toISOString().split("T")[0],
      count: Number(r.count),
    })),
    monthlyTrend: monthlyTrend.map((r) => ({
      month: r.month,
      count: Number(r.count),
    })),
  };
}
