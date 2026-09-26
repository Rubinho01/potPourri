import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

// Recebe o buffer do multer (upload em memória, sem salvar em disco) e
// transmite pro Cloudinary via stream.
export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Falha ao enviar imagem para o Cloudinary'));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

export function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}
