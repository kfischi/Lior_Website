# אתר משרד עורכי דין ליאור — Lior Law Office

A Hebrew (RTL) marketing website for a luxury law office, built with **Next.js 16**,
**React 19**, **TypeScript** and **Tailwind CSS v4**.

The design follows a *Trust & Authority* system: a deep authority **navy** palette
with **gold** accents on a warm ivory canvas, an authoritative Hebrew serif
(Frank Ruhl Libre) for headings and a clean Hebrew sans (Heebo) for body copy.

## Sections

Single-page layout (`src/app/page.tsx`):

1. **Hero** — headline, dual CTA, trust points, credential badge
2. **Stats** — proof bar (years, cases, satisfaction)
3. **Practice areas** — six service cards with line icons
4. **About** — bio, credentials, signature
5. **Process** — four-step working process
6. **Testimonials** — client quotes
7. **FAQ** — accordion
8. **Contact** — form + direct contact channels (phone / WhatsApp / email)
9. **Footer** + a mobile sticky call/WhatsApp bar

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static)
npm run start    # serve the production build
npm run lint
```

## Editing content

All copy lives in **one file**: `src/content/site.ts`. It currently holds
realistic Hebrew **placeholder** copy. Replace the fields marked `// TODO`
with the real firm details:

- `firmName`, `lawyerName`, `tagline`, `description`, `url`
- `contact` — phone, WhatsApp (intl digits), email, address, hours
- `practiceAreas`, `about` (bio + credentials), `testimonials`, `faq`

Editing only this file updates the whole site.

## Adding real photos

The site ships with on-brand placeholders. The four expected images are:

| File (place in `public/images/`)      | Used in        |
| ------------------------------------- | -------------- |
| `hero-law-office-interior.jpg`        | Hero           |
| `lawyer-portrait-professional.jpg`    | About portrait |
| `scales-justice-golden.jpg`           | (optional)     |
| `law-firm-meeting-room.jpg`           | (optional)     |

To switch a placeholder to a real photo:

1. Drop the image into `public/images/` (keep the filename above).
2. Add that filename to the set in `src/content/images.ts`.

`MediaFrame` then renders the photo via `next/image`; until then it shows a
branded placeholder so the layout never looks broken.

## Notes

- Fully responsive (375 / 768 / 1024 / 1440px), keyboard-accessible focus
  states, and `prefers-reduced-motion` respected.
- Reveal-on-scroll animations degrade gracefully — content is always visible
  without JavaScript.
- The contact form has no backend wired yet; on submit it composes an email to
  the office address as a fallback. Wire it to your provider of choice when ready.
