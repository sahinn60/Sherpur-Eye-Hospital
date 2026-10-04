import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response";
import * as cms from "../services/cms.service";
import { config } from "../config/env";
import {
  upsertSettingsSchema,
  bulkUpdateSectionsSchema,
  createNoticeSchema,
  updateNoticeSchema,
} from "../validators/cms.validator";

// ─── Image Upload ───────────────────────────────────────────────────────────────────────────────

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "কোনো ফাইল পাওয়া যায়নি" });
      return;
    }
    const url = (req.file as any).cloudinaryUrl || req.file.filename;
    res.json(successResponse("আপলোড সফল", { filename: url, url }));
  } catch (e) { next(e); }
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.getAllSettings();
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function getPublicSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.getPublicSettings();
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function saveSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { settings } = upsertSettingsSchema.parse(req.body);
    const data = await cms.upsertSettings(settings);
    res.json(successResponse("সেটিংস সংরক্ষিত হয়েছে", data));
  } catch (e) { next(e); }
}

// ─── Sections ────────────────────────────────────────────────────────────────

export async function getSections(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.getAllSections();
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function saveSections(req: Request, res: Response, next: NextFunction) {
  try {
    const { sections } = bulkUpdateSectionsSchema.parse(req.body);
    const data = await cms.bulkUpdateSections(sections);
    res.json(successResponse("সেকশন আপডেট হয়েছে", data));
  } catch (e) { next(e); }
}

// ─── Notices ─────────────────────────────────────────────────────────────────

export async function getNotices(req: Request, res: Response, next: NextFunction) {
  try {
    const activeOnly = req.query.active === "true";
    const data = await cms.listNotices(activeOnly);
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function addNotice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.createNotice(createNoticeSchema.parse(req.body));
    res.status(201).json(successResponse("নোটিশ যোগ হয়েছে", data));
  } catch (e) { next(e); }
}

export async function editNotice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.updateNotice(req.params.id, updateNoticeSchema.parse(req.body) as any);
    res.json(successResponse("নোটিশ আপডেট হয়েছে", data));
  } catch (e) { next(e); }
}

export async function removeNotice(req: Request, res: Response, next: NextFunction) {
  try {
    await cms.deleteNotice(req.params.id);
    res.json(successResponse("নোটিশ মুছে গেছে"));
  } catch (e) { next(e); }
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export async function submitContact(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone, subject, message } = req.body;
    if (!name || !phone || !message) {
      res.status(400).json({ success: false, message: "নাম, ফোন ও বার্তা আবশ্যক" });
      return;
    }
    const data = await cms.createContactMessage({ name, phone, subject: subject || "", message });
    res.status(201).json(successResponse("বার্তা পাঠানো হয়েছে", data));
  } catch (e) { next(e); }
}

export async function getContactMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.listContactMessages();
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function markContactRead(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await cms.markMessageRead(req.params.id);
    res.json(successResponse("ok", data));
  } catch (e) { next(e); }
}

export async function deleteContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    await cms.deleteContactMessage(req.params.id);
    res.json(successResponse("মুছে গেছে"));
  } catch (e) { next(e); }
}
