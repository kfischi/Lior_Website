import type { Brand } from '@/lib/sanity/settings';

/**
 * The part of the brand that client components need, with the edited settings applied.
 * It is a subset on purpose: the rest never travels to the browser.
 */
export type ClientBrand = Pick<
  Brand,
  'firmName' | 'firmNameShort' | 'attorneyName' | 'phone' | 'phoneE164' | 'whatsapp' | 'email' | 'logo'
> & {
  hero: Pick<
    Brand['hero'],
    | 'title'
    | 'eyebrow'
    | 'subtitle'
    | 'primaryCta'
    | 'secondaryCta'
    | 'videoUrl'
    | 'posterId'
    | 'imageId'
    | 'mediaFrame'
    | 'videoTrimEnd'
    | 'videoCuts'
  >;
  chat: Brand['chat'];
  about: { additionalAreas: Brand['about']['additionalAreas'] };
  practiceAreas: Brand['practiceAreas'];
  hasReviews: boolean;
};

/** What the server hands to the provider. Kept in one place so the subset stays honest. */
export function toClientBrand(b: Brand, hasReviews: boolean): ClientBrand {
  return {
    firmName: b.firmName,
    firmNameShort: b.firmNameShort,
    attorneyName: b.attorneyName,
    phone: b.phone,
    phoneE164: b.phoneE164,
    whatsapp: b.whatsapp,
    email: b.email,
    logo: b.logo,
    hero: {
      title: b.hero.title,
      eyebrow: b.hero.eyebrow,
      subtitle: b.hero.subtitle,
      primaryCta: b.hero.primaryCta,
      secondaryCta: b.hero.secondaryCta,
      videoUrl: b.hero.videoUrl,
      posterId: b.hero.posterId,
      imageId: b.hero.imageId,
      mediaFrame: b.hero.mediaFrame,
      videoTrimEnd: b.hero.videoTrimEnd,
      videoCuts: b.hero.videoCuts,
    },
    chat: b.chat,
    about: { additionalAreas: b.about.additionalAreas },
    practiceAreas: b.practiceAreas,
    hasReviews,
  };
}

