'use client';

import * as React from 'react';
import type { ChatKitConfig } from './types';

type Props = {
  config: ChatKitConfig;
  /** True while the assistant reads an answer aloud (recording or browser voice): the avatar video moves then. */
  speaking: boolean;
  /** Tells the parent when the welcome recording starts or stops, so it can silence the browser voice. */
  onWelcomePlayingChange?: (playing: boolean) => void;
  /** The stop button: the parent stops the browser voice and any recording. */
  onStop: () => void;
};

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The window at the top of the chat. Everything comes from local files in /public: no service, no cost.
 *
 *  - `welcome.poster`: still image of the assistant, always the base layer (and the fallback if a video fails).
 *  - `welcome.video`: a silent looping clip of the avatar. It plays while the welcome recording plays and while an
 *    answer is read aloud, and rests on its first frame otherwise. It stays still for people who asked for less motion.
 *  - `welcome.videoHasSound`: the clip itself carries the welcome voice (a real "talking video"). It then plays once
 *    on the play button and is not used for answers.
 *  - `welcome.audio`: a recording of the welcome, played on the play button, with live captions and a full transcript.
 *
 * Controls: play/pause, stop and mute, all keyboard-operable, 44px targets.
 */
export function AvatarVideoPlayer({ config, speaking, onWelcomePlayingChange, onStop }: Props) {
  const { welcome, labels } = config;
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [welcomePlaying, setWelcomePlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const videoHasSound = Boolean(welcome.videoHasSound && welcome.video);
  const hasVideo = Boolean(welcome.video) && !videoFailed;
  const hasWelcomeMedia = videoHasSound ? hasVideo : Boolean(welcome.audio);
  const captions = welcome.captions ?? [{ start: 0, text: welcome.message }];
  const activeIndex = captions.reduce((found, caption, index) => (time >= caption.start ? index : found), 0);
  // The silent loop moves while someone is being spoken to, and only then.
  const moving = !videoHasSound && (welcomePlaying || speaking);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || videoHasSound) return;
    if (moving && !prefersReducedMotion()) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [moving, videoHasSound]);

  const media = (): HTMLMediaElement | null => (videoHasSound ? videoRef.current : audioRef.current);

  const setPlaying = (value: boolean) => {
    setWelcomePlaying(value);
    onWelcomePlayingChange?.(value);
  };

  const toggle = () => {
    const element = media();
    if (!element) return;
    if (element.paused) void element.play().catch(() => undefined);
    else element.pause();
  };

  const stop = () => {
    const element = media();
    if (element) {
      element.pause();
      element.currentTime = 0;
    }
    setTime(0);
    onStop();
  };

  // Nothing to show (no image, video or recording configured): the chat is simply the messages.
  if (!welcome.poster && !welcome.video && !welcome.audio) return null;

  const mediaEvents = {
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => {
      setPlaying(false);
      setTime(0);
    },
    onTimeUpdate: (event: React.SyntheticEvent<HTMLMediaElement>) => setTime(event.currentTarget.currentTime),
  };
  const buttonClass =
    'inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return (
    <section aria-label={config.assistantName} className="border-b border-black/10 bg-neutral-900 text-white">
      <div className="relative h-40 w-full overflow-hidden sm:h-44">
        {welcome.poster && (
          // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the kit free of next/image setup
          <img src={welcome.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
        )}
        {hasVideo && welcome.video && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-top"
            muted={muted || !videoHasSound}
            loop={!videoHasSound}
            playsInline
            preload="metadata"
            poster={welcome.poster}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
            {...(videoHasSound ? mediaEvents : {})}
          >
            {welcome.video.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
        {(hasWelcomeMedia || moving) && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
            {hasWelcomeMedia && (
              <button type="button" onClick={toggle} aria-pressed={welcomePlaying} className={`${buttonClass} bg-white text-neutral-900`}>
                <span className="sr-only">{welcomePlaying ? labels.pause : labels.listen}</span>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  {welcomePlaying ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
            )}
            <p aria-live="polite" className="min-w-0 flex-1 text-sm leading-snug">
              {welcomePlaying ? captions[activeIndex]?.text : ''}
            </p>
            {(welcomePlaying || speaking) && (
              <button type="button" onClick={stop} className={`${buttonClass} bg-white/15`}>
                <span className="sr-only">{labels.stopListening}</span>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  <path d="M6 6h12v12H6z" />
                </svg>
              </button>
            )}
            {hasWelcomeMedia && (
              <button type="button" onClick={() => setMuted((value) => !value)} aria-pressed={muted} className={`${buttonClass} bg-white/15`}>
                <span className="sr-only">{muted ? labels.unmute : labels.mute}</span>
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                  {muted ? (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
                  )}
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      {!videoHasSound && welcome.audio && (
        <audio ref={audioRef} src={welcome.audio} muted={muted} preload="none" {...mediaEvents} />
      )}
      <details className="px-3 py-2 text-sm text-white/90">
        <summary className="min-h-11 cursor-pointer py-2 focus-visible:outline-2 focus-visible:outline-white">
          {labels.transcript}
        </summary>
        <p className="pb-2 leading-relaxed">{captions.map((caption) => caption.text).join(' ')}</p>
      </details>
    </section>
  );
}
