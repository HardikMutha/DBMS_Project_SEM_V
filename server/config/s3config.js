import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import multerS3 from "multer-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."), false);
  }
};

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const randomName = crypto.randomBytes(16).toString("hex");
      const timeStamp = Date.now();
      const filename = `campground_images/${randomName}-${timeStamp}${fileExtension}`;
      cb(null, filename);
    },
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        uploadDate: new Date().toISOString(),
      });
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});
