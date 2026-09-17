'use client';

import { useEffect, useRef, useState } from 'react';

export default function FoundersVideo({
  videoUrl,
  quote,
  signature
}: {
  videoUrl?: string;
  quote: string;
  signature: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoWorking, setVideoWorking] = useState(false);
  const [videoGaveUp, setVideoGaveUp] = useState(false);
  const videoWorkingRef = useRef(false);
  const showVideo = Boolean(videoUrl) && videoWorking && !videoGaveUp;

  useEffect(() => {
    if (!videoUrl) return;
    const timer = setTimeout(() => {
      if (!videoWorkingRef.current) setVideoGaveUp(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [videoUrl]);

  useEffect(() => {
    // Same robust resume as Philosophy's background video: a plain .play()
    // isn't always enough after a long time backgrounded (the browser can
    // fully release the decoded buffer, not just pause it) -- reload the
    // source if it isn't actually progressing shortly after we ask it to
    // resume.
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
    <div className="relative aspect-[4/5] max-w-[420px] mx-auto overflow-hidden bg-charcoal">
      {videoUrl && !videoGaveUp && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${showVideo ? '' : 'opacity-0'}`}
          src={videoUrl}
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
        <div className="absolute inset-0 flex items-center justify-center border border-dashed border-charcoal/30">
          <span className="text-[10px] tracking-[0.2em] uppercase text-ivory/60 font-light">Video coming soon</span>
        </div>
      )}
      {/* Quote + signature are HTML overlaid on the video, not baked into
          the file -- swapping the video later never loses this text. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-ivory pointer-events-none"
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}
      >
        <p className="serif-display italic text-[1.1rem] md:text-[1.3rem] font-light leading-[1.5]">
          &ldquo;{quote}&rdquo;
        </p>
        <p className="mt-4 text-[11px] tracking-[0.28em] uppercase font-light" style={{ color: '#e9dcc2' }}>
          {signature}
        </p>
      </div>
    </div>
  );
}
