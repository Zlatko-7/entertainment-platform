import fs from "fs";
import path from "path";
import multer from "multer";
import { AppError } from "../errors/app-error.js";

// Vercel’s function filesystem is read-only except /tmp.
const postersDir = process.env.VERCEL
  ? path.join("/tmp", "uploads", "posters")
  : path.resolve("uploads/posters");

function ensurePostersDir() {
  fs.mkdirSync(postersDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      ensurePostersDir();
      cb(null, postersDir);
    } catch (error) {
      cb(error as Error, postersDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const uploadPoster = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError("Poster must be a JPEG, PNG, WebP, or GIF image", 400));
      return;
    }
    cb(null, true);
  },
}).single("poster");
