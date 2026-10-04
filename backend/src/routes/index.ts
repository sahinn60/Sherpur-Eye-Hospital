import { Router } from "express";
import authRoutes from "./auth.routes";
import doctorRoutes from "./doctor.routes";
import serviceRoutes from "./service.routes";
import appointmentRoutes from "./appointment.routes";
import galleryRoutes from "./gallery.routes";
import newsRoutes from "./news.routes";
import dashboardRoutes from "./dashboard.routes";
import employeeRoutes from "./employee.routes";
import attendanceRoutes from "./attendance.routes";
import leaveRoutes from "./leave.routes";
import notificationRoutes from "./notification.routes";
import patientRoutes from "./patient.routes";
import clinicRoutes from "./clinic.routes";
import billingRoutes from "./billing.routes";
import financeRoutes from "./finance.routes";
import surgeryRoutes from "./surgery.routes";
import inventoryRoutes from "./inventory.routes";
import prescriptionRoutes from "./prescription.routes";
import cmsRoutes from "./cms.routes";
import auditRoutes from "./audit.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth",          authRoutes);
router.use("/doctors",       doctorRoutes);
router.use("/services",      serviceRoutes);
router.use("/appointments",  appointmentRoutes);
router.use("/gallery",       galleryRoutes);
router.use("/news",          newsRoutes);
router.use("/dashboard",     dashboardRoutes);
router.use("/employees",     employeeRoutes);
router.use("/attendance",    attendanceRoutes);
router.use("/leave",         leaveRoutes);
router.use("/notifications", notificationRoutes);
router.use("/patients",      patientRoutes);
router.use("/clinic",        clinicRoutes);
router.use("/billing",       billingRoutes);
router.use("/finance",       financeRoutes);
router.use("/surgery",       surgeryRoutes);
router.use("/inventory",     inventoryRoutes);
router.use("/prescriptions",  prescriptionRoutes);
router.use("/cms",           cmsRoutes);
router.use("/audit",         auditRoutes);

export default router;
