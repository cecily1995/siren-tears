type HeroData = {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  bgUrl?: string;
  bgAlt?: string;
  scrollLabel?: string;
};

import Image from 'next/image';

export default function Hero({ data }: { data: HeroData }) {
  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden text-ivory grain"
    >
      {/* Background image with slow Ken Burns */}
      <div
        className="absolute inset-0 bg-img bg-center bg-cover animate-kenburns"
        style={{ backgroundImage: `url(${data.bgUrl})` }}
        role="img"
        aria-label={data.bgAlt || ''}
      />

      {/* Warm coastal tonal wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(38,35,31,0.45) 0%, rgba(38,35,31,0.18) 30%, rgba(38,35,31,0.10) 55%, rgba(38,35,31,0.55) 100%)'
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-70"
        style={{
          background:
            'radial-gradient(60% 50% at 70% 30%, rgba(245, 215, 165, 0.55) 0%, rgba(245, 215, 165, 0) 70%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl">
            {data.eyebrow && (
              <p
                className="eyebrow text-ivory/80 mb-8 opacity-0 animate-[fadeIn_1.4s_ease-out_0.6s_forwards]"
              >
                <span className="divider-line mr-4" />
                {data.eyebrow}
                <span className="divider-line ml-4" />
              </p>
            )}
            <div className="opacity-0 animate-[fadeUp_1.4s_cubic-bezier(0.22,1,0.36,1)_0.9s_forwards]">
              <Image
                src="/logo/siren-tears-logo-full-ivory.png"
                alt={data.title || 'Siren Tears'}
                width={1200}
                height={453}
                priority
                className="w-full max-w-[280px] sm:max-w-[380px] md:max-w-[520px] h-auto mx-auto"
              />
            </div>
            <p
              className="mt-8 text-[0.95rem] md:text-[1.05rem] font-light text-ivory/85 max-w-xl mx-auto leading-[1.9] opacity-0 animate-[fadeUp_1.4s_cubic-bezier(0.22,1,0.36,1)_1.4s_forwards]"
            >
              {data.body}
            </p>
            <div className="mt-12 opacity-0 animate-[fadeUp_1.4s_cubic-bezier(0.22,1,0.36,1)_1.8s_forwards]">
              <a
                href="#collections"
                className="link-underline text-[12px] tracking-[0.42em] uppercase font-light text-ivory"
              >
                {data.ctaLabel ?? 'Explore Collections'}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="pb-10 flex justify-center opacity-0 animate-[fadeIn_1.2s_ease-out_2.4s_forwards]">
          <div className="flex flex-col items-center gap-3 text-ivory/70">
            <span className="text-[10px] tracking-[0.4em] uppercase">{data.scrollLabel ?? 'Scroll'}</span>
            <span className="block w-px h-12 bg-ivory/40 relative overflow-hidden">
              <span className="absolute left-0 top-0 w-full h-4 bg-ivory/90 animate-[shimmer_2.8s_ease-in-out_infinite]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
