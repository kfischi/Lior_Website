/**
 * Registry of real photos that have been added to /public/images.
 *
 * The site ships with branded placeholders. To use a real photo:
 *   1. Drop the file into  public/images/  (keep the same filename used in
 *      src/content/site.ts, e.g. "hero-law-office-interior.jpg").
 *   2. Add that filename to the set below.
 * MediaFrame will then render the photo instead of the placeholder.
 */
export const availableImages = new Set<string>([
  // "hero-law-office-interior.jpg",
  // "lawyer-portrait-professional.jpg",
  // "scales-justice-golden.jpg",
  // "law-firm-meeting-room.jpg",
]);
