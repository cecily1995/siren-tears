'use client';

import { useCallback, useEffect, useRef } from 'react';

type Props = { src: string; className?: string; onPlaybackStart?: () => void };

/** A decorative video that automatically recovers after browser suspension. */
export default function ReliableAutoplayVideo({ src, className, onPlaybackStart }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const retryTimer = useRef<number | null>(null);

  const play = useCallback(() => {
    const video = ref.current;
    if (!video || document.visibilityState === 'hidden') return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    void video.play().catch(() => undefined);
  }, []);

  const retrySoon = useCallback(() => {
    if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    retryTimer.current = window.setTimeout(play, 350);
  }, [play]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    play();
    const onVisible = () => document.visibilityState === 'visible' && play();
    const watchdog = window.setInterval(() => {
      if (video.paused || video.ended) play();
    }, 4000);

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', play);
    window.addEventListener('focus', play);
    window.addEventListener('online', play);
    document.addEventListener('pointerdown', play, { passive: true });
    document.addEventListener('touchstart', play, { passive: true });
    return () => {
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
      window.clearInterval(watchdog);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', play);
      window.removeEventListener('focus', play);
      window.removeEventListener('online', play);
      document.removeEventListener('pointerdown', play);
      document.removeEventListener('touchstart', play);
    };
  }, [play]);

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      onLoadedData={play}
      onCanPlay={play}
      onPlaying={onPlaybackStart}
      onPause={retrySoon}
      onStalled={retrySoon}
      onSuspend={retrySoon}
      onEnded={() => {
        const video = ref.current;
        if (video) video.currentTime = 0;
        play();
      }}
    />
  );
}
