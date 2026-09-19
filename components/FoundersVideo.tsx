'use client';

import { useState } from 'react';
import ReliableAutoplayVideo from './ReliableAutoplayVideo';

export default function FoundersVideo({
  videoUrl,
  quote,
  signature
}: {
  videoUrl?: string;
  quote: string;
  signature: string;
}) {
  const [videoWorking, setVideoWorking] = useState(false);
  const showVideo = Boolean(videoUrl) && videoWorking;

  return (
    <div className="relative aspect-[4/5] max-w-[420px] md:max-w-[640px] mx-auto overflow-hidden bg-charcoal">
      {videoUrl && (
        <ReliableAutoplayVideo
          className={`absolute inset-0 w-full h-full object-cover ${showVideo ? '' : 'opacity-0'}`}
          src={videoUrl}
          onPlaybackStart={() => setVideoWorking(true)}
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
