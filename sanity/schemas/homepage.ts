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
