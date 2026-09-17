'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';

type Data = {
  images?: string[];
  eyebrow: string;
  title: string;
  cta: string;
};

const ROTATE_MS = 5000;
const FADE_MS = 1200;

// The whole section is one link to /new-arrivals -- background photos
// rotate on their own (managed in Studio: Home > New Arrivals banner),
// but the copy is fixed and never changes with them.
export default function NewArrivalsBanner({ data }: { data: Data }) {
  const images = data.images && data.images.length ? data.images : [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return null;

  return (
    <section className="px-4 md:px-8 py-3 md:py-10">
      <Link
        href="/new-arrivals"
        className="relative block aspect-[16/9] md:aspect-[21/9] max-w-[1480px] mx-auto overflow-hidden bg-charcoal/5"
      >
        {images.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={url}
            src={url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(20,24,26,0.28) 0%, rgba(20,24,26,0.02) 45%, rgba(20,24,26,0.15) 100%)'
          }}
        />
        <div
          className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-14 text-ivory"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}
        >
          <p className="text-[11px] md:text-[13px] tracking-[0.28em] uppercase font-light mb-3" style={{ color: '#e9dcc2' }}>
            {data.eyebrow}
          </p>
          <h2 className="serif-display text-[1.6rem] md:text-[clamp(1.7rem,3.4vw,2.6rem)] font-light leading-[1.2] mb-4">
            {data.title}
          </h2>
          <span className="text-[11px] md:text-[12px] tracking-[0.26em] uppercase border-b border-ivory/70 pb-1">
            {data.cta}
          </span>
        </div>
      </Link>
    </section>
  );
}
