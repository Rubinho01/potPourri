import multer from 'multer';
import { AppError } from '../utils/AppError';

// Upload em memória (buffer), sem gravar em disco — o buffer é repassado
// direto pro Cloudinary em cloudinaryUpload.ts
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError('O arquivo enviado precisa ser uma imagem', 422));
      return;
    }
    cb(null, true);
  },
});
