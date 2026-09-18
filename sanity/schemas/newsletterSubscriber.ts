import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsletterSubscriber',
  title: 'Newsletter Subscribers',
  type: 'document',
  fields: [
    defineField({ name: 'email', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subscribedAt', type: 'datetime' })
  ],
  preview: {
    select: { title: 'email', subtitle: 'subscribedAt' }
  }
});
