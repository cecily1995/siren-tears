import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'orderEnquiry',
  title: 'Order Enquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'reference',
      to: [{ type: 'purchaseRequest' }],
      validation: (r) => r.required()
    }),
    defineField({ name: 'customerName', title: 'Customer name', type: 'string' }),
    defineField({ name: 'customerEmail', title: 'Customer email', type: 'string' }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 4, validation: (r) => r.required() }),
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
    select: { title: 'customerName', subtitle: 'message', status: 'status' },
    prepare({ title, subtitle, status }) {
      return { title: `${title || 'Enquiry'} (${status})`, subtitle };
    }
  }
});
