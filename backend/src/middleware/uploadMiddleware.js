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

function ticketFileFilter(_req, file, callback) {
  const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error('Only images, PDF, and Word documents are allowed for ticket attachments'));
    return;
  }

  callback(null, true);
}

export const ticketUpload = multer({
  storage,
  fileFilter: ticketFileFilter,
  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024
  }
});

function importFileFilter(_req, file, callback) {
  const allowedMimeTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'];
  const allowedExtensions = ['.csv', '.txt'];
  const fileName = file.originalname?.toLowerCase() || '';

  if (!allowedMimeTypes.includes(file.mimetype) && !allowedExtensions.some((extension) => fileName.endsWith(extension))) {
    callback(new Error('Upload a CSV file exported from Excel or Google Sheets'));
    return;
  }

  callback(null, true);
}

export const importUpload = multer({
  fileFilter: importFileFilter,
  storage,
  limits: {
    files: 1,
    fileSize: 8 * 1024 * 1024
  }
});
