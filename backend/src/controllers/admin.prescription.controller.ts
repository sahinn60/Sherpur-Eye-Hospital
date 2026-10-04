import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import { prisma } from "../config/database";
import * as svc from "../services/prescription.service";
import { cloudinary } from "../middleware/upload";

// ─── Hospital Prescription Settings (stored in SiteSetting, group = rx_hospital) ──

const RX_HOSPITAL_KEYS = [
  "rx_hospital_logo", "rx_hospital_name_bn", "rx_hospital_name_en",
  "rx_hospital_address", "rx_hospital_phone", "rx_hospital_emergency",
  "rx_hospital_email", "rx_hospital_website",
  "rx_header_text", "rx_footer_text",
  "rx_show_logo", "rx_layout",
];

export async function getHospitalRxSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { group: "rx_hospital" },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    res.json(successResponse("ok", map));
  } catch (e) { next(e); }
}

export async function saveHospitalRxSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const data: Record<string, string> = req.body;
    const ops = Object.entries(data)
      .filter(([key]) => RX_HOSPITAL_KEYS.includes(key))
      .map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value, group: "rx_hospital", labelBn: key, labelEn: key, type: "text" },
        })
      );
    await Promise.all(ops);
    const rows = await prisma.siteSetting.findMany({ where: { group: "rx_hospital" } });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    res.json(successResponse("হাসপাতাল সেটিংস সংরক্ষিত হয়েছে।", map));
  } catch (e) { next(e); }
}

export async function uploadHospitalLogo(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) { res.status(400).json({ success: false, message: "ফাইল পাওয়া যায়নি।" }); return; }
    const logoUrl = (req.file as any).cloudinaryUrl || req.file.filename;
    await prisma.siteSetting.upsert({
      where: { key: "rx_hospital_logo" },
      update: { value: logoUrl },
      create: { key: "rx_hospital_logo", value: logoUrl, group: "rx_hospital", labelBn: "হাসপাতাল লোগো", labelEn: "Hospital Logo", type: "image" },
    });
    res.json(successResponse("লোগো আপলোড হয়েছে।", { logoUrl }));
  } catch (e) { next(e); }
}

// ─── Admin: list all doctors with their prescription settings ─────────────────

export async function listDoctorsWithSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { isActive: true },
      select: {
        id: true, nameBn: true, nameEn: true, photo: true,
        designationBn: true, qualificationBn: true, phone: true,
        specialtyBn: true,
        prescriptionSettings: {
          select: {
            id: true, nameBn: true, nameEn: true,
            qualificationBn: true, qualificationEn: true,
            designationBn: true, designationEn: true,
            specialtyBn: true, specialtyEn: true,
            bmdcNo: true, chamberName: true, chamberAddress: true, chamberPhone: true,
            signatureUrl: true, signatureMode: true,
            preferredLang: true, showHeader: true, showFooter: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { nameEn: "asc" },
    });
    res.json(successResponse("ok", doctors));
  } catch (e) { next(e); }
}

// ─── Admin: get/update a specific doctor's prescription settings ──────────────

export async function getDoctorRxSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { doctorId } = req.params;
    const settings = await svc.getDoctorSettings(doctorId);
    res.json(successResponse("ok", settings));
  } catch (e) { next(e); }
}

export async function saveDoctorRxSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { doctorId } = req.params;
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId }, select: { id: true } });
    if (!doctor) { res.status(404).json({ success: false, message: "চিকিৎসক পাওয়া যায়নি।" }); return; }
    const data = await svc.upsertDoctorSettings(doctorId, req.body);
    res.json(successResponse("সেটিংস সংরক্ষিত হয়েছে।", data));
  } catch (e) { next(e); }
}

export async function uploadDoctorSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const { doctorId } = req.params;
    if (!req.file) { res.status(400).json({ success: false, message: "ফাইল পাওয়া যায়নি।" }); return; }
    const signatureUrl = (req.file as any).cloudinaryUrl || req.file.filename;
    const data = await svc.saveSignature(doctorId, signatureUrl);
    res.json(successResponse("স্বাক্ষর আপলোড হয়েছে।", { signatureUrl, settings: data }));
  } catch (e) { next(e); }
}

export async function removeDoctorSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const { doctorId } = req.params;
    const settings = await svc.getDoctorSettings(doctorId);
    if (settings?.signatureUrl && settings.signatureUrl.includes("cloudinary")) {
      const publicId = (settings.signatureUrl as string).split("/").slice(-2).join("/").replace(/\.[^.]+$/, "");
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    const data = await svc.removeSignature(doctorId);
    res.json(successResponse("স্বাক্ষর মুছে গেছে।", data));
  } catch (e) { next(e); }
}
