import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'journalArticle',
  title: 'Stone Journal Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Stone / category',
      description: 'e.g. Moonstone, Aquamarine, Labradorite, Amethyst'
    }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, title: 'Excerpt' }),
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string' }]
    }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published at' }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      of: [{ type: 'block' }]
    })
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'cover' }
  }
});
