const { randomUUID } = require("node:crypto");
const express = require("express");
const { mkdir, readdir, stat, writeFile } = require("node:fs/promises");
const path = require("node:path");
const multer = require("multer");
const sharp = require("sharp");
const { rateLimit } = require("express-rate-limit");

const { apiPublicUrl } = require("../config");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PROCESSED_IMAGE_SIZE = 4 * 1024 * 1024;
const MAX_TOTAL_IMAGE_STORAGE = 250 * 1024 * 1024;
const uploadDirectory = path.join(__dirname, "../../uploads/product-images");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
let reservedStorage = 0;
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user.id,
  message: { error: "Upload limit reached. Try again later." },
});

const parseImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1, fields: 0, parts: 1 },
  fileFilter(req, file, callback) {
    if (!allowedTypes.has(file.mimetype)) {
      const error = new Error("Choose a JPEG, PNG, or WebP image");
      error.status = 400;
      return callback(error);
    }
    return callback(null, true);
  },
}).single("image");

function receiveImage(req, res, next) {
  // translate multipart parser failures into the api error format
  parseImage(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Images must be 5 MB or smaller" });
    }
    return res.status(error.status || 400).json({ error: error.message });
  });
}

router.post("/images", authenticate, requireAdmin, uploadRateLimit, receiveImage, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Choose an image to upload" });

  let processedImage;
  try {
    // inspect and decode the bytes instead of trusting the uploaded mime type
    const image = sharp(req.file.buffer, {
      failOn: "error",
      limitInputPixels: 20_000_000,
      sequentialRead: true,
    });
    const metadata = await image.metadata();
    if (!allowedTypes.has(`image/${metadata.format}`)) {
      return res.status(400).json({ error: "The selected file is not a supported image" });
    }
    processedImage = await image
      .rotate()
      .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  } catch {
    return res.status(400).json({ error: "The selected file could not be decoded as an image" });
  }

  if (processedImage.length > MAX_PROCESSED_IMAGE_SIZE) {
    return res.status(400).json({ error: "The processed image is too large" });
  }

  await mkdir(uploadDirectory, { recursive: true });
  // include in flight writes when checking the shared storage limit
  const existingFiles = await readdir(uploadDirectory, { withFileTypes: true });
  let usedStorage = 0;
  for (const entry of existingFiles) {
    if (entry.isFile() && entry.name.endsWith(".webp")) {
      usedStorage += (await stat(path.join(uploadDirectory, entry.name))).size;
    }
  }
  if (usedStorage + reservedStorage + processedImage.length > MAX_TOTAL_IMAGE_STORAGE) {
    return res.status(507).json({ error: "Image storage is full; remove unused images first" });
  }

  const filename = `${randomUUID()}.webp`;
  reservedStorage += processedImage.length;
  try {
    await writeFile(path.join(uploadDirectory, filename), processedImage, {
      flag: "wx",
      mode: 0o644,
    });
  } finally {
    reservedStorage -= processedImage.length;
  }

  const imageUrl = `${apiPublicUrl}/uploads/product-images/${filename}`;
  return res.status(201).json({ data: { imageUrl, path: `product-images/${filename}` } });
});

module.exports = router;
