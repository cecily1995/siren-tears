import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'buyerShowcase',
  title: 'Buyer Showcase (As Worn)',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional short note, e.g. the piece worn or a customer quote.'
    }),
    defineField({
      name: 'customerHandle',
      title: 'Customer name / handle',
      type: 'string',
      description: 'Optional, e.g. "@handle" or a first name — only if the customer is happy to be credited.'
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first. Leave blank to sort by newest.',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ],
  preview: {
    select: { title: 'caption', subtitle: 'customerHandle', media: 'image' }
  }
});
