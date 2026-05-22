import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'brandStory',
  title: 'Brand Story',
  type: 'document',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', initialValue: 'Our Story' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [{ type: 'text', rows: 4 }]
    }),
    defineField({
      name: 'image',
      title: 'Mood image',
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
