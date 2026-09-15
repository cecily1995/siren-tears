import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'chatEnquiry',
  title: 'Chat Enquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
      options: {
        list: [
          { title: 'Questions about an order', value: 'order' },
          { title: 'Product question', value: 'product' },
          { title: 'Shipping & Delivery', value: 'shipping' },
          { title: 'Bespoke / Custom', value: 'bespoke' },
          { title: 'Other', value: 'other' }
        ]
      }
    }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({
      name: 'member',
      title: 'Linked member (if signed in)',
      type: 'reference',
      to: [{ type: 'member' }]
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In review', value: 'in_review' },
          { title: 'Replied', value: 'replied' },
          { title: 'Closed', value: 'closed' }
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
    select: { title: 'name', subtitle: 'message', topic: 'topic', status: 'status' },
    prepare({ title, subtitle, topic, status }) {
      return { title: `${title || 'Chat'} — ${topic || 'general'} (${status})`, subtitle };
    }
  }
});
