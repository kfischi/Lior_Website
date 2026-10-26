import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { brand } from '@/lib/brand';

/** Standard shadcn/ui class merge helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Base URL of the site, without a trailing slash.
 * SITE_URL wins. Without it, production falls back to the firm's real domain
 * (never localhost, which would poison canonicals, the sitemap and social
 * previews); only `next dev` uses localhost.
 */
export function siteUrl(): string {
  const configured = process.env.SITE_URL;
  const url =
    configured ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : brand.website);
  return url.replace(/\/$/, '');
}
