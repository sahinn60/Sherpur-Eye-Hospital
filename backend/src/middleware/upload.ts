import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const SIG_DIR    = path.join(process.cwd(), "uploads", "signatures");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(SIG_DIR))    fs.mkdirSync(SIG_DIR,    { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) { cb(null, UPLOAD_DIR); },
  filename(_req, file, cb) {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const sigStorage = multer.diskStorage({
  destination(_req, _file, cb) { cb(null, SIG_DIR); },
  filename(_req, file, cb) {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `sig-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const ALLOWED     = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const SIG_ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("শুধুমাত্র JPG, PNG, WEBP, GIF, SVG ফাইল আপলোড করা যাবে"));
  },
});

export const signatureUpload = multer({
  storage: sigStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (SIG_ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("স্বাক্ষরের জন্য শুধুমাত্র JPG বা PNG ফাইল আপলোড করা যাবে"));
  },
});
