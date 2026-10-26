import { brand } from '@/lib/brand';

/** Client video reviews: native controls, nothing loads until a visitor presses play. */
export function VideoReviews() {
  const items = brand.videoReviews;
  if (items.length === 0) return null;

  return (
    <section id="video-reviews" aria-labelledby="video-reviews-title" className="section bg-navy text-cream">
      <div className="shell">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3 text-accent-light">ביקורות וידאו</p>
          <h2 id="video-reviews-title" className="text-4xl text-cream md:text-5xl">
            בדבריהם של לקוחות
          </h2>
        </div>
        <ul className="mx-auto flex max-w-5xl snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {items.map((v, i) => (
            <li key={v.src} className="w-[72%] shrink-0 snap-center md:w-auto">
              <video
                controls
                playsInline
                preload="none"
                poster={v.poster}
                aria-label={`${v.label} ${i + 1}`}
                className="aspect-[9/16] w-full rounded-2xl bg-black object-cover shadow-2xl"
              >
                <source src={v.src} type="video/mp4" />
                {v.captions && <track kind="captions" srcLang="he" label="עברית" src={v.captions} default />}
              </video>
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
