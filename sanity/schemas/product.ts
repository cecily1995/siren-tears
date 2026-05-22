import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Featured Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle / collection tag' }),
    defineField({ name: 'body', type: 'text', rows: 3, title: 'Emotional description' }),
    defineField({
      name: 'image',
      title: 'Hero product image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }]
    }),
    defineField({
      name: 'detail',
      title: 'Close-up detail image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({ name: 'stoneTitle', type: 'string', title: 'The Stone — title', initialValue: 'The Stone' }),
    defineField({ name: 'stoneBody', type: 'text', rows: 3, title: 'The Stone — body' }),
    defineField({ name: 'materialTitle', type: 'string', title: 'Material & Craft — title', initialValue: 'Material & Craft' }),
    defineField({ name: 'materialBody', type: 'text', rows: 3, title: 'Material & Craft — body' }),
    defineField({ name: 'stylingTitle', type: 'string', title: 'Styling Inspiration — title', initialValue: 'Styling Inspiration' }),
    defineField({ name: 'stylingBody', type: 'text', rows: 3, title: 'Styling Inspiration — body' })
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', media: 'image' }
  }
});
