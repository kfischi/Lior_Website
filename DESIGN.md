# DESIGN.md — Design direction

> The look and feel contract. Build to this; review against this.

## One-line direction

A **quiet-luxury, editorial law firm** — the restraint of a private wealth
manager's brand crossed with the typography of a literary journal. Calm,
authoritative, expensive. Motion is cinematic but never flashy.

## Reference feeling (not to copy)

Think: the sites of top boutique firms and luxury hospitality — Latham-tier
seriousness, Aesop-level restraint, Linear-level polish on interactions.
Generous negative space, a strong serif display, hairline rules, and a single
single cool steel-blue accent used sparingly.

## Palette (white-label; matched to this firm's logo)

| Token | Default | Use |
| --- | --- | --- |
| `navy` | `#1A3742` | Primary. Deep teal-slate, used for dark sections and the header mark. |
| `cream` | `#F4F6F6` | Page background. Cool off-white. |
| `accent` | `#3C7186` | Steel blue taken from the logo. Buttons and links on light backgrounds. |
| `accentLight` | `#8DB5C4` | The same blue, lightened. Accent text, icons and buttons on dark sections. |
| `ink` | `#17242B` | Body text on light. Blue-black. |

Rules: one accent family, used at <10% of any viewport. Large surfaces are navy
or cream. Never use `accent` for text on `navy` or `accentLight` on `cream`;
that is what the two tokens are for. All text pairs meet WCAG AA (4.5:1).
Avoid pure black and pure white.

## Typography

- **Display / headings:** Rubik (rounded modern Hebrew sans), weight 500–600.
  Calm, friendly and professional; balanced wrap, light negative tracking.
- **Body / UI:** Heebo. 16–18px base, 1.7 line-height, comfortable measure.
- Scale is generous: hero display clamps up to ~clamp(2.5rem, 6vw, 5.5rem).
- Hebrew numerals/punctuation correct; RTL throughout.

## Layout

- Max content width ~1200px, generous gutters (min 20px on mobile).
- Vertical rhythm: large section padding (`clamp(5rem, 10vw, 9rem)`).
- Asymmetric, editorial grids over centered boxes where it reads better.
- Hairline dividers (1px, low-opacity) instead of heavy cards everywhere.

## Motion (Framer Motion)

- **Reveal on scroll:** content rises 16–24px + fades, 500–700ms, custom ease
  `[0.22, 1, 0.36, 1]`, staggered children ~60–90ms. Trigger once.
- **Micro-interactions:** buttons/links have a 150–200ms state change; subtle
  magnetic/scale on primary CTAs; underline-grow on nav links.
- **Hero:** full-bleed video, slow ken-burns-free loop, dark navy gradient
  overlay for legibility; headline reveals in sequence.
- **Always** gate motion behind `prefers-reduced-motion` and provide a static
  equivalent.

## Components

- Buttons: solid navy (primary), steel-blue accent (small; `accentOnDark` on dark sections), and a "quiet" ghost
  with an animated underline. Pill or 6px radius — pick one and keep it.
- Inputs: generous height (44px+), hairline border, focus ring in accent.
- Cards: minimal — border + hover lift (translateY 4px + shadow), not loud.
- Chatbot: feels like a premium concierge — rounded panel, navy header,
  streaming text, typing/thinking indicator, suggested prompts.

## Do / Don't

- ✅ Whitespace, hairlines, one serif display, one accent, slow confident motion.
- ❌ Gradients everywhere, drop-shadows on everything, neon, emoji in UI,
  generic SaaS hero with 3 pastel blobs, yellow, more than one accent color.

## Accessibility is part of the design

Contrast, focus states, reduced-motion and keyboard paths are design
deliverables, not afterthoughts.
