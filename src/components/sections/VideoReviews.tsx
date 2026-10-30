import { brand, type VideoReview } from '@/lib/brand';
import { VideoCard } from './VideoCard';
import { YouTubeCard } from './YouTubeCard';

/** One row of cards: swipeable on a phone, centred and wrapping from tablet up. */
function Row({ items, offset, wide }: { items: VideoReview[]; offset: number; wide?: boolean }) {
  if (items.length === 0) return null;
  return (
    <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory items-start gap-5 overflow-x-auto px-1 pb-4 md:flex-wrap md:justify-center md:overflow-visible">
      {items.map((v, i) => (
        <li
          key={v.youtubeId ?? v.src}
          className={`shrink-0 snap-center ${wide ? 'w-[88%] md:w-[26rem]' : 'w-[72%] md:w-52'}`}
        >
          {v.youtubeId !== undefined ? (
            <YouTubeCard
              videoId={v.youtubeId}
              poster={v.poster}
              label={`${v.label} ${offset + i + 1}`}
              landscape={v.landscape}
            />
          ) : (
            <VideoCard
              src={v.src}
              poster={v.poster}
              label={`${v.label} ${offset + i + 1}`}
              transcript={v.transcript}
              note={v.note}
              landscape={v.landscape}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Client video reviews: native controls, nothing loads until a visitor presses play. Tall videos
 * share one row and wide ones another, so the cards line up instead of mixing shapes.
 */
export function VideoReviews() {
  const items = brand.videoReviews;
  if (items.length === 0) return null;
  const tall = items.filter((v) => !v.landscape);
  const wide = items.filter((v) => v.landscape);

  return (
    <section id="video-reviews" aria-labelledby="video-reviews-title" className="section bg-navy text-cream">
      <div className="shell">
        <div className="mb-12 text-center">
          <h2 id="video-reviews-title" className="text-4xl text-cream md:text-5xl">
            לקוחות מספרים
          </h2>
        </div>
        <div className="space-y-6">
          <Row items={tall} offset={0} />
          <Row items={wide} offset={tall.length} wide />
        </div>
        <p className="mt-8 text-center text-sm text-cream/70">
          חוות דעת אישיות של לקוחות. אין בהן הבטחה או הערכה לתוצאה במקרה אחר.
        </p>
        <p className="mt-2 text-center text-sm text-cream/70">
          התמלולים נוצרו אוטומטית וייתכנו בהם אי-דיוקים. מקומות שלא נשמעו בבירור מסומנים.
        </p>
      </div>
    </section>
  );
}
