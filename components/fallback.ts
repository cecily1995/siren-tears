/**
 * Editorial fallback content used when the Sanity project is not yet configured.
 * All of this is overridable from the Sanity Studio at /studio.
 */

// Curated Unsplash imagery matching the coastal-luxury, soft-cinematic mood.
const U = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const fallback = {
  hero: {
    eyebrow: 'A Southern Hemisphere Atelier',
    title: 'SIREN TEARS',
    body: 'Natural crystal jewelry shaped by quality and timeless aesthetics.',
    ctaLabel: 'Explore Collections',
    bgUrl: U('photo-1507525428034-b723cf961d3e', 2400),
    bgAlt: 'Soft golden hour light along a quiet coastline'
  },
  philosophy: {
    sectionLabel: 'Philosophy',
    sectionTitle: 'A house built on stillness and stone.',
    pillars: [
      {
        title: 'Natural Materials',
        body: 'We value the raw beauty of natural crystals and preserve their original texture and character.'
      },
      {
        title: 'Timeless Aesthetics',
        body: 'We reject fast trends and create pieces designed to transcend time.'
      },
      {
        title: 'Quality First',
        body: 'From stone selection to craftsmanship, every detail is handled with intention and care.'
      }
    ]
  },
  collections: [
    {
      _id: 'c1',
      title: 'Moon Tide',
      subtitle: 'Reflections, quiet water, silver moonlight.',
      slug: { current: 'moon-tide' },
      coverUrl: U('photo-1611652022419-a9419f74343d', 1600),
      coverAlt: 'Moonstone pendant catching soft light',
      scale: 'tall'
    },
    {
      _id: 'c2',
      title: 'Ocean Memory',
      subtitle: 'Salt, sand, the long horizon.',
      slug: { current: 'ocean-memory' },
      coverUrl: U('photo-1505236858219-8359eb29e329', 1800),
      coverAlt: 'Aquamarine drop earring against linen',
      scale: 'wide'
    },
    {
      _id: 'c3',
      title: 'Venus Veil',
      subtitle: 'A whisper of softness and gold.',
      slug: { current: 'venus-veil' },
      coverUrl: U('photo-1599643478518-a784e5dc4c8f', 1400),
      coverAlt: 'Gold and pearl earring detail',
      scale: 'small'
    },
    {
      _id: 'c4',
      title: 'Salt Light',
      subtitle: 'The hour the sea turns to glass.',
      slug: { current: 'salt-light' },
      coverUrl: U('photo-1515562141207-7a88fb7ce338', 1600),
      coverAlt: 'Crystal jewelry resting on warm linen',
      scale: 'large'
    }
  ],
  featured: {
    title: 'Moon Tide No.07',
    subtitle: 'From the Moon Tide collection',
    body: 'Inspired by the quiet reflection of moonlight across deep ocean water.',
    imageUrl: U('photo-1573408301185-9146fe634ad0', 1800),
    imageAlt: 'Moon Tide No.07 pendant photographed in natural light',
    detailUrl: U('photo-1611591437281-460bfbe1220a', 1400),
    stoneTitle: 'The Stone',
    stoneBody:
      'Hand-selected rainbow moonstone, chosen for its rare adularescence — a slow, silver-blue shimmer that surfaces only when the light shifts.',
    materialTitle: 'Material & Craft',
    materialBody:
      'Set in 18k recycled gold with a softly brushed finish. Each piece is shaped by hand at our coastal studio, with no two ever truly alike.',
    stylingTitle: 'Styling Inspiration',
    stylingBody:
      'Worn against linen at the long lunch table. Layered with finer chains for the evening. Left to rest beside a window when not in wear.'
  },
  journal: [
    {
      _id: 'j1',
      title: 'Moonstone — the stone that holds the light.',
      slug: { current: 'moonstone' },
      category: 'Moonstone',
      excerpt:
        'Once carried by fishermen of the Adriatic and worn by Roman women in summer, moonstone has always been the quiet companion of those who live close to water.',
      coverUrl: U('photo-1602173574767-37ac01994b2a', 1400),
      publishedAt: '2024-08-04'
    },
    {
      _id: 'j2',
      title: 'Aquamarine — a record of the sea.',
      slug: { current: 'aquamarine' },
      category: 'Aquamarine',
      excerpt:
        'The Romans believed aquamarine fell from the jewel-cases of sirens. We think of it more simply: a stone the colour of the southern shallows on an unhurried morning.',
      coverUrl: U('photo-1531995811006-35cb42e1a022', 1400),
      publishedAt: '2024-07-12'
    },
    {
      _id: 'j3',
      title: 'Labradorite — the field of light beneath the surface.',
      slug: { current: 'labradorite' },
      category: 'Labradorite',
      excerpt:
        'A stone that asks for patience. Its colour does not arrive immediately — it waits for the angle of late afternoon, then opens into a whole sky.',
      coverUrl: U('photo-1518895949257-7621c3c786d7', 1400),
      publishedAt: '2024-06-30'
    },
    {
      _id: 'j4',
      title: 'Amethyst — the discipline of quiet purple.',
      slug: { current: 'amethyst' },
      category: 'Amethyst',
      excerpt:
        'We work with amethyst the way a tailor works with navy: as a base colour, restrained, deeply considered, and slow to reveal itself.',
      coverUrl: U('photo-1535632787350-4e68ef0ac584', 1400),
      publishedAt: '2024-06-02'
    }
  ],
  brandStory: {
    eyebrow: 'Our Story',
    title: 'Six years, one shoreline, a slow practice in stone.',
    paragraphs: [
      'SIREN TEARS began on a long stretch of southern coast — the kind of place where the light arrives late and stays soft, where weather is something you read like a page.',
      'For six years we have worked with a small circle of stone cutters and goldsmiths, refusing to hurry. Our pieces are sold quietly, to a community of women across more than thirty countries who care about how a thing is made, and how long it will last.',
      'Everything we make is made to be kept — passed on, reset, returned to the sea of personal history. Nothing here is disposable.'
    ],
    imageUrl: U('photo-1519046904884-53103b34b206', 2000),
    imageAlt: 'Linen and warm sunlight by an ocean window',
    stats: [
      { value: '06', label: 'Years of dedication' },
      { value: '30+', label: 'Countries' },
      { value: '01', label: 'Coastal atelier' }
    ]
  },
  settings: {
    brandName: 'SIREN TEARS',
    tagline: 'Natural crystal jewelry, made slowly by the southern sea.',
    instagramUrl: 'https://instagram.com/',
    xiaohongshuUrl: 'https://www.xiaohongshu.com/',
    wechatHandle: 'sirentears.studio',
    email: 'studio@sirentears.com'
  }
};
