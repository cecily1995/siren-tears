import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'buyerShowcase',
  title: 'Buyer Showcase (As Worn)',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
        }
      ],
      description: 'All the photos from this one customer / piece. The first photo is used as the cover in the gallery grid.',
      validation: (r) => r.min(1)
    }),
    defineField({
      name: 'video',
      title: 'Video (optional)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Optional — a short video from this customer, shown alongside their photos.'
    }),
    defineField({
      name: 'caption',
      title: 'Caption (customer\u2019s voice)',
      type: 'text',
      rows: 3,
      description: 'Written as if the customer is saying it themselves, first person. E.g. "I wear this one almost every day."'
    }),
    defineField({
      name: 'customerHandle',
      title: 'Customer name / handle',
      type: 'string',
      description: 'Shown below the photo(s), e.g. "Livvy" or "@handle". Leave blank if the customer prefers not to be named.'
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
    select: { title: 'customerHandle', subtitle: 'caption', media: 'images.0' }
  }
});
