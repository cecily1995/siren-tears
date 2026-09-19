import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'brandStory',
  title: 'Brand Story',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', initialValue: 'Our Story' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Story text (supports bold)',
      description: 'Use the toolbar to apply bold text. This replaces the legacy paragraphs below when filled in.',
      type: 'array',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }], lists: [] }]
    }),
    defineField({
      name: 'paragraphs',
      title: 'Legacy paragraphs (fallback)',
      type: 'array',
      of: [{ type: 'text', rows: 4 }]
    }),
    defineField({
      name: 'image',
      title: 'Display image (16:9, shown under the logo)',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }]
    }),
    defineField({
      name: 'stats',
      title: 'Stats / accents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value (e.g. "6")' },
            { name: 'label', type: 'string', title: 'Label (e.g. "Years of dedication")' }
          ]
        }
      ]
    })
  ],
  preview: { prepare: () => ({ title: 'Brand Story' }) }
});
