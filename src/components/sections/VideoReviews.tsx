import { brand } from '@/lib/brand';
import { VideoCard } from './VideoCard';
import { YouTubeCard } from './YouTubeCard';

/** Client video reviews: native controls, nothing loads until a visitor presses play. */
export function VideoReviews() {
  const items = brand.videoReviews;
  if (items.length === 0) return null;

  return (
    <section id="video-reviews" aria-labelledby="video-reviews-title" className="section bg-navy text-cream">
      <div className="shell">
        <div className="mb-12 text-center">
          <h2 id="video-reviews-title" className="text-4xl text-cream md:text-5xl">
            לקוחות מספרים
          </h2>
        </div>
        <ul className="mx-auto flex max-w-5xl snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:overflow-visible">
          {items.map((v, i) => (
            <li key={v.youtubeId ?? v.src} className="w-[72%] shrink-0 snap-center self-center md:w-[calc((100%-2.5rem)/3)]">
              {v.youtubeId !== undefined ? (
                <YouTubeCard
                  videoId={v.youtubeId}
                  poster={v.poster}
                  label={`${v.label} ${i + 1}`}
                  landscape={v.landscape}
                />
              ) : (
                <VideoCard
                  src={v.src}
                  poster={v.poster}
                  label={`${v.label} ${i + 1}`}
                  captions={v.captions}
                  landscape={v.landscape}
                />
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-sm text-cream/70">
          חוות דעת אישיות של לקוחות. אין בהן הבטחה או הערכה לתוצאה במקרה אחר.
        </p>
      </div>
    </section>
  );
}
