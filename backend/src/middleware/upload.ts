import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED     = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const SIG_ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

// Memory storage — file goes to buffer, then we upload to Cloudinary
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("শুধুমাত্র JPG, PNG, WEBP, GIF, SVG ফাইল আপলোড করা যাবে"));
  },
});

export const signatureUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (SIG_ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new Error("স্বাক্ষরের জন্য শুধুমাত্র JPG বা PNG ফাইল আপলোড করা যাবে"));
  },
});

// Middleware to upload buffer to Cloudinary after multer
export function uploadToCloudinary(folder = "uploads") {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (err, result) => { if (err) reject(err); else resolve(result); }
        );
        stream.end(req.file!.buffer);
      });
      // Attach cloudinary URL to req.file so controllers can use it
      (req.file as any).cloudinaryUrl  = result.secure_url;
      (req.file as any).cloudinaryId   = result.public_id;
      req.file.filename = result.secure_url; // keep backward compat
      next();
    } catch (err) {
      next(err);
    }
  };
}

export { cloudinary };
