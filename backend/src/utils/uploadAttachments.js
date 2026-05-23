import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer?.length) {
      reject(new Error('Invalid attachment file'));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'gaurav-nursery/tickets',
        resource_type: 'auto',
        overwrite: false
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result?.url && !result?.secure_url) reject(new Error('Cloudinary upload failed'));
        else
          resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id || '',
            filename: file.originalname,
            mimeType: file.mimetype
          });
      }
    );

    stream.on('error', reject);
    Readable.from(file.buffer).pipe(stream);
  });
}

export async function uploadTicketAttachments(files = []) {
  if (!files.length) return [];

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  return Promise.all(files.map(uploadBuffer));
}
