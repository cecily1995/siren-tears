'use client';

import { useState } from 'react';

type PhilosophyData = {
  sectionLabel?: string;
  sectionTitle?: string;
  videoUrl?: string;
  pillars?: { title?: string; body?: string }[];
};

export default function Philosophy({ data }: { data: PhilosophyData }) {
  // Not every browser can play every video container/codec (e.g. Chrome
  // generally can't play .mov files the way Safari can) -- if the video
  // fails to load or decode, fall back to the plain texture rather than
  // showing nothing.
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = Boolean(data.videoUrl) && !videoFailed;

  return (
    <section className="relative bg-pearl text-charcoal py-32 md:py-44 px-6 md:px-12 overflow-hidden">
      {/* Soft continuity from the ocean hero above: a dark-to-pearl bridge, not a hard cut. */}
      <div
        className="absolute inset-x-0 top-0 h-40 md:h-56 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(38,35,31,0.5) 0%, rgba(255,255,255,0) 100%)'
        }}
      />
      {showVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={data.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
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
