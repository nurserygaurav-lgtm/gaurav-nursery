import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    if (!file?.buffer?.length) {
      reject(new Error('Invalid image file'));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'gaurav-nursery/products',
        resource_type: 'image',
        overwrite: false,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result?.secure_url || !result?.public_id) reject(new Error('Cloudinary upload failed'));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.on('error', reject);
    Readable.from(file.buffer).pipe(stream);
  });
}

function uploadBase64Image(base64, folder = 'gaurav-nursery/products') {
  return new Promise((resolve, reject) => {
    const cleanBase64 = String(base64 || '').replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '').trim();
    if (!cleanBase64) {
      reject(new Error('Invalid generated image data'));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        overwrite: false,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result?.secure_url || !result?.public_id) reject(new Error('Cloudinary upload failed'));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.on('error', reject);
    Readable.from(Buffer.from(cleanBase64, 'base64')).pipe(stream);
  });
}

export async function uploadProductImages(files = []) {
  if (!files.length) return [];

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  return Promise.all(files.map(uploadBuffer));
}

export async function uploadProductImageUrls(urls = []) {
  const cleanUrls = urls.map((url) => String(url || '').trim()).filter(Boolean);
  if (!cleanUrls.length) return [];

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return cleanUrls.map((url) => ({ url, publicId: '' }));
  }

  return Promise.all(
    cleanUrls.map(async (url) => {
      try {
        const result = await cloudinary.uploader.upload(url, {
          folder: 'gaurav-nursery/products',
          resource_type: 'image',
          overwrite: false,
          quality: 'auto',
          fetch_format: 'auto'
        });

        if (!result?.secure_url || !result?.public_id) {
          console.warn(`Cloudinary upload failed for URL: ${url}`);
          return { url, publicId: '' };
        }

        return { url: result.secure_url, publicId: result.public_id };
      } catch (uploadError) {
        console.warn(`Cloudinary remote image upload failed for URL: ${url}`, uploadError?.message || uploadError);
        return { url, publicId: '' };
      }
    })
  );
}

export async function uploadGeneratedImage(base64) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  return uploadBase64Image(base64);
}
