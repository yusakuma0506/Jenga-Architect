'use server';

import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD_BYTES,
} from '@/lib/validation';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function uploadToCloud(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const file = formData.get('file') as File | null;
  if (!file || !(file instanceof File)) {
    throw new Error('No file provided');
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('File too large');
  }

  const extension = EXTENSION_BY_MIME[file.type] ?? 'jpg';
  const filename = `profiles/${session.user.id}-${Date.now()}.${extension}`;

  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: false,
  });

  return blob.url;
}
