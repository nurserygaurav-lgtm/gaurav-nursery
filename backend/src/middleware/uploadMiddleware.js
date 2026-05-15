import multer from 'multer';

const storage = multer.memoryStorage();

function fileFilter(_req, file, callback) {
  if (!file.mimetype?.startsWith('image/')) {
    callback(new Error('Only image files are allowed'));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  fileFilter,
  storage,
  limits: {
    files: 6,
    fileSize: 5 * 1024 * 1024
  }
});
