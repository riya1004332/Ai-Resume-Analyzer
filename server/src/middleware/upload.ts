import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = file.originalname.toLowerCase().split('.').pop();
  const isValidExt = ext === 'pdf' || ext === 'docx';
  const isValidMime = allowedMimeTypes.includes(file.mimetype) || file.mimetype === 'application/octet-stream';

  if (isValidExt && (isValidMime || ext === 'docx')) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only standard PDF (.pdf) and Microsoft Word (.docx) documents are permitted.'
      )
    );
  }
};

export const resumeUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5242880 // 5MB
  },
  fileFilter
}).single('resume');

