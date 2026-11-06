import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { sanityEnv } from '@/sanity/env';
import { StudioDirection } from '@/components/layout/StudioDirection';

export { metadata, viewport } from 'next-sanity/studio';

export const dynamic = 'force-static';

/** The editing screen for the office. The editor signs in with their own Sanity account. */
export default function StudioPage() {
  if (!sanityEnv.enabled) {
    return (
      <main className="grid min-h-screen place-items-center bg-cream p-8 text-center">
        <p className="max-w-md text-lg text-ink">ממשק העריכה כבוי: לא הוגדר מזהה פרויקט ב־brand.ts.</p>
      </main>
    );
  }
  return (
    <>
      <StudioDirection />
      <NextStudio config={config} />
    </>
  );
}
