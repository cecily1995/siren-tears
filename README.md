# SIREN TEARS — Brand Website

A luxury jewelry brand site for **SIREN TEARS**, built as an editorial single-page experience with a fully managed CMS so the brand owner can keep content fresh without ever touching the code.

> Coastal luxury · old money · soft cinematic light · timeless aesthetics.

---

## Stack

- **Next.js 14** (App Router, React Server Components)
- **Tailwind CSS** with a custom palette: warm ivory, pearl, sand, ocean gray-blue, muted gold, deep charcoal
- **Sanity v3** Studio mounted at `/studio`
- `next-sanity` for typed GROQ queries with ISR (60 s revalidation)
- **Cormorant Garamond** (display serif) + **Inter** (body sans) via `next/font`

---

## Quick start

```bash
# 1. Install
cd siren-tears
npm install

# 2. The site runs immediately with editorial fallback content
npm run dev
# → http://localhost:3000
```

The homepage uses high-quality fallback copy and imagery out of the box, so you can preview the design before configuring Sanity.

---

## Connect the CMS (one-time)

1. Create a free Sanity project at <https://www.sanity.io/manage> (no credit card needed).
2. Copy `.env.local.example` to `.env.local` and fill in:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. From the Sanity dashboard → **API → CORS Origins**, add `http://localhost:3000` and your production URL.
4. Restart `npm run dev`.
5. Open <http://localhost:3000/studio>. Sign in with the same email you used on sanity.io.

That's it — the Studio is now live, embedded into the same site.

---

## What the brand owner can edit

The Studio sidebar is intentionally minimal. Each section maps 1:1 to what appears on the homepage:

| Studio item | Controls |
| --- | --- |
| **Site Settings** | Brand name, tagline, Instagram / Xiaohongshu / WeChat / email |
| **Homepage** | Hero (title, subtitle, CTA, background image), three Philosophy pillars, and which product is featured |
| **Brand Story** | Eyebrow, headline, paragraphs, mood image, three accent stats |
| **Collections** | Add a new collection (title, subtitle, slug, cover image, gallery scale, additional imagery) |
| **Featured Products** | Long-form product storytelling — `The Stone`, `Material & Craft`, `Styling Inspiration` |
| **Stone Journal** | Editorial articles with cover image, category (Moonstone, Aquamarine, etc.), excerpt, full rich text body |

**No code required.** Drag an image in, hit Publish, the site refreshes within 60 seconds.

### Adding new content — the patterns

- **Upload a new jewelry image** → open a Collection or Product, drop the image into the image field.
- **Edit homepage hero** → Studio → *Homepage* → *Hero*.
- **Add a new collection** → Studio → *Collections* → *Create new*.
- **Publish a journal article** → Studio → *Stone Journal* → *Create new*.
- **Update brand story** → Studio → *Brand Story*.

---

## Project structure

```
siren-tears/
├── app/
│   ├── layout.tsx              # Fonts, global wrappers, page veil
│   ├── page.tsx                # Homepage — composes every section
│   ├── globals.css             # Tokens, animations, editorial styles
│   └── studio/[[...tool]]/     # Sanity Studio mount point (/studio)
├── components/
│   ├── Hero.tsx
│   ├── Philosophy.tsx
│   ├── Collections.tsx         # Asymmetric gallery grid
│   ├── FeaturedProduct.tsx     # Long-form product story
│   ├── Journal.tsx             # Editorial article grid
│   ├── BrandStory.tsx          # Mood image + paragraphs + accent stats
│   ├── Footer.tsx              # Contact / social
│   ├── Navigation.tsx          # Fades from translucent to ivory on scroll
│   ├── PageVeil.tsx            # Soft fade-in on first paint
│   ├── RevealOnScroll.tsx      # IntersectionObserver reveal
│   └── fallback.ts             # Editorial content used when Sanity is empty
├── sanity/
│   ├── env.ts
│   ├── lib/
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── queries.ts          # GROQ queries, safe against missing config
│   └── schemas/
│       ├── siteSettings.ts
│       ├── homepage.ts
│       ├── brandStory.ts
│       ├── collection.ts
│       ├── product.ts
│       └── journalArticle.ts
├── sanity.config.ts            # Studio configuration + sidebar layout
├── tailwind.config.ts          # Brand palette, fonts, motion keyframes
└── README.md
```

---

## Design notes

- **No white-background catalog feeling.** Every section sits on tonal beige / pearl / ivory or rich charcoal. Imagery is editorial and full-bleed.
- **Slow motion.** Animations all use `cubic-bezier(0.22, 1, 0.36, 1)` over 1–1.6 s. The hero uses a 18-second Ken Burns pan; product and gallery images zoom subtly on hover.
- **Typography hierarchy.** Cormorant Garamond at 3.2–7.5 rem for display, Inter at 0.92–1 rem at 1.9 line-height for body. Eyebrows are 11 px, 0.32 em letter-spacing, muted gold.
- **No prices, no carts, no discount language.** This is presented as a house, not a shop.
- **Soft cinematic light.** Hero applies a warm golden radial gradient + a subtle film-grain SVG noise overlay.
- **Sticky narrative.** The brand-story image sticks while the paragraphs scroll — a small luxury-magazine touch.

---

## Deploy

The standard Next.js Vercel deploy works:

```bash
# 1. Push to GitHub
# 2. Import into Vercel
# 3. Add the same env vars from .env.local to Vercel's project settings
# 4. Deploy
```

After deploy, add the production URL to **Sanity → API → CORS Origins**.

---

## Replacing the fallback imagery

The fallback Unsplash imagery in `components/fallback.ts` is there only so the site renders beautifully before any content is added. As soon as you add a real Hero background, a real Brand Story image, a Featured product, etc. in the Studio, those replace the fallbacks automatically.

You can delete `components/fallback.ts` once all sections have real content — or leave it as a safety net.
