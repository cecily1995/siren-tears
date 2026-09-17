import { defineField, defineType } from 'sanity';

const imageWithAlt = {
  type: 'image',
  options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
};

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        { name: 'eyebrow', type: 'string', title: 'Eyebrow (small label)' },
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'body', type: 'text', rows: 2, title: 'Subtitle / description' },
        { name: 'ctaLabel', type: 'string', title: 'CTA label', initialValue: 'Explore Collections' },
        { name: 'background', title: 'Background image', ...imageWithAlt }
      ]
    }),
    defineField({
      name: 'newArrivals',
      title: 'New Arrivals banner (homepage)',
      type: 'object',
      description:
        'The rotating-photo banner on the homepage that links to the New Arrivals page. Its text ("Just In, From The Atelier" / "New one-of-one pieces." / "Discover New Pieces") is fixed and not editable here -- only the background photos rotate.',
      fields: [
        {
          name: 'images',
          title: 'Rotating background images',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }],
          description:
            'Add as many as you like -- they cross-fade on a loop behind the fixed banner text. At least one is needed for the banner to show anything.'
        }
      ]
    }),
    defineField({
      name: 'aotearoaBannerImage',
      title: 'Aotearoa banner image (homepage)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Background photo for the homepage\'s Aotearoa (gemstone) banner. This is separate from the Aotearoa banner image on the Collections page -- changing one does not affect the other.'
    }),
    defineField({
      name: 'philosophy',
      title: 'Brand Philosophy',
      type: 'object',
      fields: [
        { name: 'sectionLabel', type: 'string', title: 'Section label', initialValue: 'Philosophy' },
        { name: 'sectionTitle', type: 'string', title: 'Section title' },
        {
          name: 'backgroundVideo',
          type: 'file',
          title: 'Background video (optional)',
          description:
            'Plays silently on loop behind this section. Keep it short (a few seconds, looping) and under ~15MB so it loads quickly -- this is a background texture, not a video the visitor presses play on. Falls back to the plain water-texture background if left empty.',
          options: { accept: 'video/*' }
        },
        {
          name: 'pillars',
          type: 'array',
          title: 'Pillars (3 recommended)',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string' },
                { name: 'body', type: 'text', rows: 3 }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product Story',
      type: 'reference',
      to: [{ type: 'product' }]
    })
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) }
});
