import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'shopProduct',
  title: 'Shop Product',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'story', title: 'Story & copy' },
    { name: 'media', title: 'Photos & packaging' },
    { name: 'specs', title: 'Specs' }
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The full product title, e.g. "White Phantom Quartz & Green Fluorite Beaded Bracelet".',
      group: 'basics',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      group: 'basics',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Bracelet — Beaded (手串)', value: 'braceletBead' },
          { title: 'Bracelet — Chain (手链)', value: 'braceletChain' },
          { title: 'Necklace', value: 'necklace' },
          { title: 'Ring', value: 'ring' },
          { title: 'Pendant', value: 'pendant' },
          { title: 'Bangle', value: 'bangle' },
          { title: 'Earring', value: 'earring' }
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'productLine',
      title: 'Product line',
      type: 'string',
      description: 'Beaded Collections (Mosaic, Last Queen, etc) vs Aotearoa (gemstone fine jewellery).',
      group: 'basics',
      options: {
        list: [
          { title: 'Beaded Collections', value: 'beaded' },
          { title: 'Aotearoa — Gemstone Jewellery', value: 'aotearoa' }
        ],
        layout: 'radio'
      },
      initialValue: 'beaded',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: 'basics'
    }),
    defineField({
      name: 'price',
      title: 'Price (NZD)',
      type: 'number',
      group: 'basics',
      validation: (r) => r.required().min(0)
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Reserved', value: 'reserved' },
          { title: 'Sold', value: 'sold' },
          { title: 'Bespoke only', value: 'bespoke' }
        ],
        layout: 'radio'
      },
      initialValue: 'available',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'isNewArrival',
      title: 'New Arrival',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description: 'Turn this on to include the piece on the New Arrivals page.'
    }),
    defineField({
      name: 'stone',
      title: 'Stone name (short)',
      type: 'string',
      description:
        'Just the gem name, e.g. "White Phantom Quartz & Green Fluorite" — no need to repeat the product name. Shown as the small subtitle under the title on the product page.',
      group: 'story'
    }),
    defineField({
      name: 'stoneStory',
      title: 'Stone story (paragraph)',
      type: 'text',
      rows: 4,
      description:
        'A few sentences telling the story of this stone — where it\'s from, what makes it special. Shown further down the page, under "The Stone" heading.',
      group: 'story'
    }),
    defineField({
      name: 'pieceStory',
      title: 'Piece story (paragraph)',
      type: 'text',
      rows: 4,
      description: 'A few sentences about the design of this specific piece. Shown under "The Piece" heading.',
      group: 'story'
    }),
    defineField({
      name: 'materialsCare',
      title: 'Materials & Care',
      type: 'text',
      rows: 4,
      description: 'Care instructions, shown in the "Materials & Care" section on the product page.',
      group: 'story'
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
        }
      ],
      validation: (r) => r.min(1)
    }),
    defineField({
      name: 'packagingDescription',
      title: 'Packaging description',
      type: 'text',
      rows: 7,
      initialValue: 'Every SIREN TEARS jewelry comes with a complete gift set:\n• Dark brown premium jewelry box\n• Brand paper gift bag\n• Champagne silk storage pouch\n• Brand greeting card\nThe full gift set is ready for gifting. Please store your crystal in the silk pouch after use to prevent scratches and impacts.',
      description: 'Line breaks and bullet points are preserved exactly on the product page.',
      group: 'media'
    }),
    defineField({
      name: 'packagingImage',
      title: 'Packaging image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
      group: 'media'
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'What it\'s made of, e.g. "Natural quartz, silver-toned metal accents". Shown in Details.',
      group: 'specs'
    }),
    defineField({
      name: 'length',
      title: 'Length / Size',
      type: 'string',
      description: 'Fit info, e.g. "Fits wrist 14-20cm". Shown in Details.',
      group: 'specs'
    }),
    defineField({
      name: 'craftedIn',
      title: 'Crafted in',
      type: 'string',
      initialValue: 'New Zealand',
      group: 'specs'
    }),
    defineField({
      name: 'checkoutLockExpiresAt',
      title: 'Checkout hold expires at',
      type: 'datetime',
      readOnly: true,
      description:
        'Set automatically for a few minutes while a customer is paying for this piece, so a second customer can\'t buy it out from under them. Clears itself once expired or once payment completes. Never edit manually.',
      group: 'specs'
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first on the Shop page. Leave as 0 if you don\'t mind the order.',
      initialValue: 0,
      group: 'specs'
    })
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ],
  preview: {
    select: { title: 'name', subtitle: 'status', media: 'images.0' }
  }
});
