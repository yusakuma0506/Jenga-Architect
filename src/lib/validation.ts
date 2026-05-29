const ALLOWED_IMAGE_HOSTS = [
  "public.blob.vercel-storage.com",
  "blob.vercel-storage.com",
];

export function isAllowedProfileImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_IMAGE_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const MAX_FEEDBACK_LENGTH = 2000;

export const MAX_SOLO_QUIZ_LIMIT = 108;
