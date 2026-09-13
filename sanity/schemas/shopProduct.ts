import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'shopProduct',
  title: 'Shop Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Bracelet', value: 'bracelet' },
          { title: 'Necklace', value: 'necklace' },
          { title: 'Ring', value: 'ring' },
          { title: 'Pendant', value: 'pendant' }
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }]
    }),
    defineField({ name: 'stone', title: 'Stone', type: 'string' }),
    defineField({ name: 'price', title: 'Price (NZD)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
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
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
        }
      ],
      validation: (r) => r.min(1)
    }),
    defineField({ name: 'stoneStory', title: 'The Stone', type: 'text', rows: 4 }),
    defineField({ name: 'pieceStory', title: 'The Piece', type: 'text', rows: 4 }),
    defineField({ name: 'material', title: 'Material', type: 'string' }),
    defineField({ name: 'length', title: 'Length / Size', type: 'string' }),
    defineField({ name: 'craftedIn', title: 'Crafted in', type: 'string', initialValue: 'New Zealand' }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      initialValue: 0
    })
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }
  ],
  preview: {
    select: { title: 'name', subtitle: 'status', media: 'images.0' }
  }
});
