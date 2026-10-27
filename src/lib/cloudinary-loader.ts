'use client';

/**
 * Cloudinary custom loader for next/image (modern approach).
 *
 * Wired up in next.config.mjs via:
 *   images.loader = 'custom'
 *   images.loaderFile = './src/lib/cloudinary-loader.ts'
 *
 * Usage in components:
 *   <Image src="folder/public-id" width={1200} height={800} alt="..." />
 *
 * `src` is the Cloudinary public ID (NOT a full URL). Absolute URLs and local
 * /public assets are passed through untouched so the loader is safe everywhere.
 */

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  '';

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  // Pass through absolute URLs and local public assets unchanged.
  if (/^https?:\/\//.test(src) || src.startsWith('/')) {
    return src;
  }

  // f_auto = best format (AVIF/WebP), q_auto = automatic quality, c_limit = never upscale.
  const params = [
    'f_auto',
    `q_${quality || 'auto'}`,
    'c_limit',
    `w_${width}`,
  ].join(',');

  const publicId = src.replace(/^\//, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}/${publicId}`;
}
