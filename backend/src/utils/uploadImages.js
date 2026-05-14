import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'gaurav-nursery/products',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });
}

export async function uploadProductImages(files = []) {
  if (!files.length) return [];

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  return Promise.all(files.map(uploadBuffer));
}
