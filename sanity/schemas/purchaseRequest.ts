import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'purchaseRequest',
  title: 'Purchase Request',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'purchaseRequestItem',
          fields: [
            defineField({ name: 'productName', title: 'Product', type: 'string' }),
            defineField({ name: 'productSlug', title: 'Product slug', type: 'string' }),
            defineField({
              name: 'product',
              title: 'Linked shop product',
              type: 'reference',
              to: [{ type: 'shopProduct' }],
              description:
                'Set automatically when the request is submitted. Used to auto-mark the product as Sold when this request is marked Paid or Shipped.'
            }),
            defineField({ name: 'price', title: 'Price (NZD)', type: 'number' }),
            defineField({ name: 'wristSize', title: 'Wrist size', type: 'string' }),
            defineField({ name: 'ringSize', title: 'Ring size', type: 'string' })
          ],
          preview: {
            select: { title: 'productName', subtitle: 'price' }
          }
        }
      ]
    }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp / Phone', type: 'string' }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({ name: 'shippingAddress', title: 'Shipping address', type: 'text', rows: 3 }),
    defineField({ name: 'message', title: 'Customer notes', type: 'text', rows: 4 }),
    defineField({ name: 'trackingNumber', title: 'NZ Post tracking number', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Confirmed availability', value: 'confirmed' },
          { title: 'Payment link sent', value: 'payment_sent' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Declined / unavailable', value: 'declined' }
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
    select: { title: 'name', items: 'items' },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return { title: title || 'Purchase request', subtitle: `${count} item${count === 1 ? '' : 's'}` };
    }
  }
});
