import multer from 'multer';

// Uploads are kept in memory only long enough to stream them to Cloudinary.
// No ephemeral container filesystem is used for newly uploaded product media.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => (/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only image files are allowed'))),
});
