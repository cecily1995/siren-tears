import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle / mood line' }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    }),
    defineField({
      name: 'scale',
      title: 'Gallery scale',
      type: 'string',
      description: 'Controls the cell size in the gallery grid.',
      options: { list: ['tall', 'wide', 'large', 'small'], layout: 'radio' },
      initialValue: 'tall'
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0
    }),
    defineField({
      name: 'gallery',
      title: 'Additional imagery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
        }
      ]
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'cover' }
  }
});
