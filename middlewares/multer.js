import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', "image/jpg", 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    const err = new Error('File type not allowed');
    err.code = 'INVALID_FILE_TYPE';
    console.error(err);
    cb(err, false);
  }
  cb(null, true);
}

export const uploadFile = multer({
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});