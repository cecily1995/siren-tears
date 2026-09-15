'use client';

import { useState } from 'react';
import BespokeForm from './BespokeForm';

type Track = {
  key: 'beaded' | 'gemstone';
  title: string;
  subtitle: string;
  time: string;
  body: string;
};

type Labels = {
  tracksTitle: string;
  tracksDisclaimer: string;
  chooseHint: string;
  formTitle: string;
  formIntro: string;
};

export default function BespokeTrackSelector({
  tracks,
  labels
}: {
  tracks: Track[];
  labels: Labels;
}) {
  const [selected, setSelected] = useState<'beaded' | 'gemstone' | null>(null);

  return (
    <section className="bg-pearl px-6 md:px-12 py-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <p className="eyebrow text-center mb-4">{labels.tracksTitle}</p>
        <div className="mx-auto h-px w-16 bg-gold/60 mb-6 md:mb-10" />

        <div className="grid grid-cols-2 gap-3 md:gap-8">
          {tracks.map((track, i) => {
            const isSelected = selected === track.key;
            const isOtherSelected = selected !== null && !isSelected;
            return (
              <button
                key={track.key}
                type="button"
                onClick={() => setSelected(track.key)}
                className={`text-left border p-5 md:p-11 transition-colors duration-500 ${
                  isSelected
                    ? 'bg-charcoal border-charcoal text-ivory'
                    : isOtherSelected
                    ? 'bg-ivory/60 border-charcoal/10 text-ash/60'
                    : 'bg-ivory border-charcoal/12 text-charcoal hover:border-gold/50'
                }`}
                style={{ transitionDelay: `${i * 140}ms` }}
              >
                <p
                  className={`text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.32em] uppercase mb-2 md:mb-4 font-light ${
                    isSelected ? 'text-gold' : 'text-gold/80'
                  }`}
                >
                  {track.subtitle}
                </p>
                <h2 className="serif-display text-[1.05rem] md:text-[1.7rem] font-light leading-tight mb-2 md:mb-3">
                  {track.title}
                </h2>
                <p className="text-[0.82rem] md:text-[1rem] font-light mb-2 md:mb-5">{track.time}</p>
                <p
                  className={`text-[0.78rem] md:text-[0.92rem] leading-[1.7] md:leading-[1.9] font-light ${
                    isSelected ? 'text-ivory/80' : 'text-ash'
                  }`}
                >
                  {track.body}
                </p>
              </button>
            );
          })}
        </div>

        {!selected && (
          <p className="mt-8 md:mt-10 text-center text-[0.82rem] text-ash/70 font-light max-w-2xl mx-auto leading-relaxed">
            {labels.tracksDisclaimer}
          </p>
        )}

        {/* Form appears immediately below the selected card, in this same
            screen -- no separate section, no scroll required to reach it. */}
        {selected && (
          <div className="mt-10 md:mt-14 max-w-[760px] mx-auto">
            <div className="text-center mb-10">
              <p className="eyebrow mb-4">{labels.formTitle}</p>
              <p className="text-[0.95rem] leading-[1.9] text-ash font-light max-w-md mx-auto">
                {labels.formIntro}
              </p>
            </div>
            <BespokeForm key={selected} track={selected} />
          </div>
        )}
      </div>
    </section>
  );
}
