import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'bespokeRequest',
  title: 'Bespoke Request',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp / Phone', type: 'string' }),
    defineField({ name: 'pieceType', title: 'Piece type', type: 'string' }),
    defineField({ name: 'stone', title: 'Preferred stone', type: 'string' }),
    defineField({ name: 'colour', title: 'Preferred colour', type: 'string' }),
    defineField({ name: 'budget', title: 'Budget range', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6 }),
    defineField({
      name: 'inspirationImages',
      title: 'Inspiration images',
      type: 'array',
      of: [{ type: 'image' }]
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In consultation', value: 'consultation' },
          { title: 'Quoted', value: 'quoted' },
          { title: 'In production', value: 'production' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' }
        ]
      },
      initialValue: 'new'
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' })
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'name', subtitle: 'pieceType', media: 'inspirationImages.0' }
  }
});
