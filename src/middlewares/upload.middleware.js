import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { BadRequestError } from '../errors/api-error.js';

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR, 'documents')
  : path.resolve('uploads', 'documents');

// Ensure destination directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const storedName = `${uniqueId}${ext}`;
    cb(null, storedName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Validate extension
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new BadRequestError(
        `File extension ${ext} is not allowed. Only PDF, JPG, JPEG, and PNG files are accepted.`,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestError(
        `File MIME type ${file.mimetype} is not allowed. Only PDF and Image files are accepted.`,
        'INVALID_MIME_TYPE'
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

/**
 * Single document upload middleware with error handling wrapper
 * @param {string} fieldName
 */
export const uploadSingleDocument = (fieldName = 'file') => {
  const multerMiddleware = upload.single(fieldName);

  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(
              new BadRequestError(
                `File size exceeds maximum allowed limit of ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB.`,
                'FILE_TOO_LARGE'
              )
            );
          }
          return next(new BadRequestError(err.message, 'UPLOAD_ERROR'));
        }
        return next(err);
      }
      next();
    });
  };
};

export { UPLOAD_DIR };
