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
      title: 'Mosaic',
      subtitle: 'Many stones, one composition.',
      slug: { current: 'mosaic' },
      coverUrl: U('photo-1611652022419-a9419f74343d', 1600),
      coverAlt: 'Mixed natural stone bracelet in warm light',
      scale: 'tall'
    },
    {
      _id: 'c2',
      title: 'Last Queen',
      subtitle: 'Moonlight, rainbow moonstone, quiet transformation.',
      slug: { current: 'last-queen' },
      coverUrl: U('photo-1505236858219-8359eb29e329', 1800),
      coverAlt: 'Rainbow moonstone piece against pale linen',
      scale: 'wide'
    },
    {
      _id: 'c3',
      title: 'Golden Age',
      subtitle: 'Warm gold, champagne, antique ease.',
      slug: { current: 'golden-age' },
      coverUrl: U('photo-1599643478518-a784e5dc4c8f', 1400),
      coverAlt: 'Warm gold and champagne stone detail',
      scale: 'small'
    },
    {
      _id: 'c4',
      title: "Siren's Chain",
      subtitle: 'Deep water, dark metal, quiet weight.',
      slug: { current: 'sirens-chain' },
      coverUrl: U('photo-1515562141207-7a88fb7ce338', 1600),
      coverAlt: 'Dark oxidised chain resting on stone',
      scale: 'large'
    },
    {
      _id: 'c5',
      title: 'Violet Hour',
      subtitle: 'Violet, muted gold, the edge of dusk.',
      slug: { current: 'violet-hour' },
      coverUrl: U('photo-1611591437281-460bfbe1220a', 1600),
      coverAlt: 'Violet and muted gold toned jewellery',
      scale: 'wide'
    },
    {
      _id: 'c6',
      title: 'One Hue',
      subtitle: 'One colour, held in quiet variation.',
      slug: { current: 'one-hue' },
      coverUrl: U('photo-1602173574767-37ac01994b2a', 1400),
      coverAlt: 'Monochromatic natural stone piece',
      scale: 'small'
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
  atelier: {
    imageUrl: U('photo-1617038260897-41a1f14a8ca0', 1800),
    imageAlt: 'Hands shaping jewellery at a quiet workbench'
  },
  settings: {
    brandName: 'SIREN TEARS',
    tagline: 'Natural crystal jewelry, made slowly by the southern sea.',
    instagramUrl: 'https://www.instagram.com/sirentears.jewellry',
    tiktokUrl: 'https://www.tiktok.com/@siren.tears',
    whatsappUrl: 'https://wa.me/64274326262',
    xiaohongshuUrl: 'https://www.xiaohongshu.com/',
    wechatHandle: 'sirentears.studio',
    email: 'studio@sirentears.com'
  },
  shopProducts: [
    {
      _id: 'sp1',
      name: 'Last Queen No.01',
      slug: { current: 'last-queen-no-01' },
      category: 'braceletBead',
      productLine: 'beaded',
      stone: 'Rainbow Moonstone',
      price: 288,
      status: 'available',
      collectionTitle: 'Last Queen',
      images: [{ url: U('photo-1611652022419-a9419f74343d', 1200), alt: 'Last Queen No.01 moonstone bracelet' }],
      material: '925 Sterling Silver',
      length: '16–17 cm',
      craftedIn: 'New Zealand',
      stoneStory:
        'Hand-selected rainbow moonstone, chosen for its rare adularescence — a slow shift of silver-blue light that surfaces only at certain angles.',
      pieceStory:
        'Hand-forged at our New Zealand studio. No two are truly alike — this piece carries the small, deliberate signatures of the hands that shaped it.'
    },
    {
      _id: 'sp2',
      name: 'Last Queen No.03',
      slug: { current: 'last-queen-no-03' },
      category: 'necklace',
      productLine: 'beaded',
      stone: 'Rainbow Moonstone',
      price: 388,
      status: 'sold',
      collectionTitle: 'Last Queen',
      images: [{ url: U('photo-1599643478518-a784e5dc4c8f', 1200), alt: 'Last Queen No.03 moonstone necklace' }],
      material: '925 Sterling Silver',
      length: '42–45 cm',
      craftedIn: 'New Zealand',
      stoneStory:
        'A single moonstone of unusually deep adularescence, set to catch the light with every movement.',
      pieceStory: 'This exact piece has found its home and will not be recreated.'
    },
    {
      _id: 'sp3',
      name: 'Golden Age No.02',
      slug: { current: 'golden-age-no-02' },
      category: 'braceletBead',
      productLine: 'beaded',
      stone: 'Champagne Citrine',
      price: 268,
      status: 'available',
      collectionTitle: 'Golden Age',
      images: [{ url: U('photo-1515562141207-7a88fb7ce338', 1200), alt: 'Golden Age No.02 citrine bracelet' }],
      material: 'Natural stone, gold-filled accents',
      length: '16–17 cm',
      craftedIn: 'New Zealand',
      stoneStory: 'A warm champagne citrine, chosen for its clarity and quiet, antique-gold warmth.',
      pieceStory: 'Hand-strung in our studio, one piece at a time.'
    },
    {
      _id: 'sp4',
      name: "Siren's Chain No.05",
      slug: { current: 'sirens-chain-no-05' },
      category: 'necklace',
      productLine: 'beaded',
      stone: 'Black Onyx',
      price: 328,
      status: 'available',
      collectionTitle: "Siren's Chain",
      images: [{ url: U('photo-1611591437281-460bfbe1220a', 1200), alt: "Siren's Chain No.05 onyx necklace" }],
      material: 'Oxidised Sterling Silver',
      length: '46 cm',
      craftedIn: 'New Zealand',
      stoneStory: 'Deep black onyx, polished to hold light like still water at night.',
      pieceStory: "Part of the Siren's Chain collection — dark metal, quiet weight, worn close."
    },
    {
      _id: 'sp5',
      name: 'Aotearoa Ring No.01',
      slug: { current: 'aotearoa-ring-no-01' },
      category: 'ring',
      productLine: 'aotearoa',
      stone: 'Australian Sapphire',
      price: 890,
      status: 'available',
      collectionTitle: 'Aotearoa',
      images: [{ url: U('photo-1611591437281-460bfbe1220a', 1200), alt: 'Aotearoa hand-set sapphire ring' }],
      material: '18k Recycled Gold',
      length: 'Made to size',
      craftedIn: 'New Zealand',
      stoneStory: 'A hand-selected sapphire, chosen for its clarity and depth of colour.',
      pieceStory: 'Hand-set in our studio as part of the Aotearoa gemstone line — fine jewellery, made slowly.'
    },
    {
      _id: 'sp5b',
      name: 'Aotearoa Necklace No.01',
      slug: { current: 'aotearoa-necklace-no-01' },
      category: 'necklace',
      productLine: 'aotearoa',
      stone: 'Ceylon Sapphire',
      price: 1180,
      status: 'available',
      collectionTitle: 'Aotearoa',
      images: [{ url: U('photo-1599643478518-a784e5dc4c8f', 1200), alt: 'Aotearoa hand-set sapphire pendant necklace' }],
      material: '18k Recycled Gold',
      length: '42–45 cm',
      craftedIn: 'New Zealand',
      stoneStory: 'A single Ceylon sapphire, set to catch light at the collarbone.',
      pieceStory: 'Part of the Aotearoa gemstone line — fine jewellery, made slowly.'
    },
    {
      _id: 'sp5c',
      name: 'Aotearoa Bangle No.01',
      slug: { current: 'aotearoa-bangle-no-01' },
      category: 'bangle',
      productLine: 'aotearoa',
      stone: 'Diamond Pavé',
      price: 1450,
      status: 'available',
      collectionTitle: 'Aotearoa',
      images: [{ url: U('photo-1611652022419-a9419f74343d', 1200), alt: 'Aotearoa diamond pavé bangle' }],
      material: '18k Recycled Gold',
      length: 'Made to size',
      craftedIn: 'New Zealand',
      stoneStory: 'Fine pavé diamonds, set edge to edge along a solid band.',
      pieceStory: 'Part of the Aotearoa gemstone line — fine jewellery, made slowly.'
    },
    {
      _id: 'sp5d',
      name: 'Aotearoa Earring No.01',
      slug: { current: 'aotearoa-earring-no-01' },
      category: 'earring',
      productLine: 'aotearoa',
      stone: 'Champagne Diamond',
      price: 780,
      status: 'available',
      collectionTitle: 'Aotearoa',
      images: [{ url: U('photo-1535632787350-4e68ef0ac584', 1200), alt: 'Aotearoa champagne diamond stud earrings' }],
      material: '18k Recycled Gold',
      length: 'Stud',
      craftedIn: 'New Zealand',
      stoneStory: 'A pair of champagne diamonds, warm against gold.',
      pieceStory: 'Part of the Aotearoa gemstone line — fine jewellery, made slowly.'
    },
    {
      _id: 'sp5e',
      name: 'Aotearoa Ring No.02',
      slug: { current: 'aotearoa-ring-no-02' },
      category: 'ring',
      productLine: 'aotearoa',
      stone: 'Emerald',
      price: 1020,
      status: 'available',
      collectionTitle: 'Aotearoa',
      images: [{ url: U('photo-1602173574767-37ac01994b2a', 1200), alt: 'Aotearoa hand-set emerald ring' }],
      material: '18k Recycled Gold',
      length: 'Made to size',
      craftedIn: 'New Zealand',
      stoneStory: 'A deep emerald, set low against the finger.',
      pieceStory: 'Part of the Aotearoa gemstone line — fine jewellery, made slowly.'
    },
    {
      _id: 'sp6',
      name: 'Violet Hour No.01',
      slug: { current: 'violet-hour-no-01' },
      category: 'braceletBead',
      productLine: 'beaded',
      stone: 'Amethyst & Muted Gold',
      price: 258,
      status: 'available',
      collectionTitle: 'Violet Hour',
      images: [{ url: U('photo-1535632787350-4e68ef0ac584', 1200), alt: 'Violet Hour amethyst and gold bracelet' }],
      material: 'Natural stone, gold-filled accents',
      length: '16–17 cm',
      craftedIn: 'New Zealand',
      stoneStory: 'Amethyst paired with muted gold, held at the edge of dusk.',
      pieceStory: 'Hand-strung in our studio, one piece at a time.'
    }
  ]
};
