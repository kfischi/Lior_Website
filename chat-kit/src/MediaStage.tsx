'use client';

import * as React from 'react';
import type { ChatKitConfig } from './types';

type Props = {
  config: ChatKitConfig;
  /** Called with the audio element's play state, so the parent can stop the browser voice while it plays. */
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * The window at the top of the chat: a still image of the assistant (or a local looping video), a play button for
 * the local welcome recording, live captions and a full transcript. All files come from /public: no service, no cost.
 */
export function MediaStage({ config, onPlayingChange }: Props) {
  const { welcome, labels } = config;
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [videoFailed, setVideoFailed] = React.useState(false);

  const captions = welcome.captions ?? [{ start: 0, text: welcome.message }];
  const activeIndex = captions.reduce((found, caption, index) => (time >= caption.start ? index : found), 0);
  const hasAudio = Boolean(welcome.audio);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play().catch(() => undefined);
    else audio.pause();
  };

  const setState = (value: boolean) => {
    setPlaying(value);
    onPlayingChange?.(value);
    const video = videoRef.current;
    if (video) {
      if (value) void video.play().catch(() => undefined);
      else video.pause();
    }
  };

  // Nothing to show (no image, video or recording configured): the chat is simply the messages.
  if (!welcome.poster && !welcome.video && !welcome.audio) return null;

  return (
    <section aria-label={config.assistantName} className="border-b border-black/10 bg-neutral-900 text-white">
      <div className="relative h-40 w-full overflow-hidden sm:h-44">
        {welcome.poster && (
          // eslint-disable-next-line @next/next/no-img-element -- a plain <img> keeps the kit free of next/image setup
          <img src={welcome.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
        )}
        {welcome.video && !videoFailed && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            poster={welcome.poster}
            aria-hidden="true"
            onError={() => setVideoFailed(true)}
          >
            {welcome.video.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
        {hasAudio && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={playing}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="sr-only">{playing ? labels.stopListening : labels.listen}</span>
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
              </svg>
            </button>
            <p aria-live="polite" className="min-w-0 flex-1 text-sm leading-snug">
              {captions[activeIndex]?.text}
            </p>
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={muted}
              className="inline-flex size-11 items-center justify-center rounded-full bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="sr-only">{muted ? labels.unmute : labels.mute}</span>
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
                {muted ? (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" />
                ) : (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
                )}
              </svg>
            </button>
          </div>
        )}
      </div>
      {hasAudio && (
        <audio
          ref={audioRef}
          src={welcome.audio}
          muted={muted}
          preload="none"
          onPlay={() => setState(true)}
          onPause={() => setState(false)}
          onEnded={() => {
            setState(false);
            setTime(0);
          }}
          onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
        />
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
