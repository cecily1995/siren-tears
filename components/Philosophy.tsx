'use client';

import { useEffect, useRef, useState } from 'react';

type PhilosophyData = {
  sectionLabel?: string;
  sectionTitle?: string;
  videoUrl?: string;
  pillars?: { title?: string; body?: string }[];
};

export default function Philosophy({ data }: { data: PhilosophyData }) {
  // Not every browser/webview can actually play a background video --
  // some (WeChat's in-app browser especially) just silently never start
  // playing rather than firing an error, so relying on onError alone
  // isn't enough. Track whether it's genuinely confirmed playing, and
  // give up on it (falling back to the plain texture) if it hasn't
  // started within a few seconds.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoWorking, setVideoWorking] = useState(false);
  const [videoGaveUp, setVideoGaveUp] = useState(false);
  const videoWorkingRef = useRef(false);
  const showVideo = Boolean(data.videoUrl) && videoWorking && !videoGaveUp;

  useEffect(() => {
    if (!data.videoUrl) return;
    const timer = setTimeout(() => {
      // Read from the ref, not the videoWorking state captured when this
      // effect first ran -- that closed-over value would always be false
      // here regardless of what actually happened since, which was
      // unconditionally forcing the video to give up after 4s every time.
      if (!videoWorkingRef.current) setVideoGaveUp(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [data.videoUrl]);

  useEffect(() => {
    // Mobile browsers commonly pause a background video when the tab/app
    // goes into the background to save power, and don't resume it on
    // their own. A plain .play() often isn't enough on its own -- after a
    // longer time in the background, the browser can fully release the
    // decoded video buffer (not just pause it), leaving it stuck/frozen
    // rather than actually resuming. Detect that by checking a moment
    // after .play() whether it's actually progressing, and reload the
    // source if not.
    const el = videoRef.current;
    if (!el) return;
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !el.paused) return;
      const timeBefore = el.currentTime;
      el.play().catch(() => undefined);
      setTimeout(() => {
        if (el.paused || el.currentTime === timeBefore) {
          el.load();
          el.play().catch(() => undefined);
        }
      }, 600);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    window.addEventListener('pageshow', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
      window.removeEventListener('pageshow', onVisible);
    };
  }, [showVideo]);

  return (
    <section className="relative bg-pearl text-charcoal py-32 md:py-44 px-6 md:px-12 overflow-hidden">
      {/* Soft continuity from the ocean hero above: a dark-to-pearl bridge, not a hard cut. */}
      <div
        className="absolute inset-x-0 top-0 h-40 md:h-56 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(38,35,31,0.5) 0%, rgba(255,255,255,0) 100%)'
        }}
      />
      {data.videoUrl && !videoGaveUp && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${
            showVideo ? '' : 'opacity-0'
          }`}
          src={data.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onPlaying={() => {
            videoWorkingRef.current = true;
            setVideoWorking(true);
          }}
          onError={() => setVideoGaveUp(true)}
        />
      )}
      {!showVideo && (
        // Faint water texture so the section carries some atmosphere rather than flat colour.
        <div
          className="absolute inset-0 bg-center bg-cover opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: "url('/textures/water-close.jpg')" }}
        />
      )}
      <div
        className={`relative mx-auto max-w-[1280px] ${showVideo ? 'text-ivory' : ''}`}
        style={showVideo ? { textShadow: '0 2px 10px rgba(0,0,0,0.55)' } : undefined}
      >
        <div className="text-center max-w-2xl mx-auto reveal">
          {data.sectionLabel && (
            <p className={`eyebrow mb-6 ${showVideo ? '!text-ivory' : ''}`}>{data.sectionLabel}</p>
          )}
          {data.sectionTitle && (
            <h2
              className={`serif-display text-[1rem] md:text-[clamp(2rem,4vw,3.4rem)] font-light leading-[1.15] ${
                showVideo ? 'text-ivory' : 'text-charcoal'
              }`}
            >
              {data.sectionTitle}
            </h2>
          )}
          <div className={`mt-10 mx-auto h-px w-16 ${showVideo ? 'bg-ivory/70' : 'bg-gold/60'}`} />
        </div>

        <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
          {(data.pillars ?? []).map((p, i) => (
            <article
              key={i}
              className="reveal text-center"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <div
                className={`text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] uppercase mb-2 md:mb-6 font-light ${
                  showVideo ? 'text-ivory/80' : 'text-gold'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3
                className={`serif-display text-[1.15rem] md:text-[2.1rem] font-light leading-tight mb-2 md:mb-6 ${
                  showVideo ? 'text-ivory' : 'text-charcoal'
                }`}
              >
                {p.title}
              </h3>
              <p
                className={`text-[0.72rem] md:text-[0.95rem] leading-[1.5] md:leading-[1.9] font-light ${
                  showVideo ? 'text-ivory/90' : 'text-ash'
                }`}
              >
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
