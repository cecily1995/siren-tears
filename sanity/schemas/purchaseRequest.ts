import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'purchaseRequest',
  title: 'Purchase Request',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order number',
      type: 'string',
      description: 'Generated automatically when the request is submitted, e.g. ST-20260915-A1B2.'
    }),
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
      name: 'stripeSessionId',
      title: 'Stripe Checkout session ID',
      type: 'string',
      description: 'Set automatically once the customer starts checkout. Used to match the payment webhook to this order.',
      readOnly: true
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe payment ID',
      type: 'string',
      description: 'Set automatically once payment succeeds. Look this ID up in the Stripe Dashboard for full payment details.',
      readOnly: true
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid at',
      type: 'datetime',
      readOnly: true
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New (enquiry, not paid)', value: 'new' },
          { title: 'Awaiting payment', value: 'payment_pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Declined / unavailable', value: 'declined' }
        ]
      },
      initialValue: 'new',
      validation: (r) => r.required()
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime' })
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'orderNumber', name: 'name', items: 'items' },
    prepare({ title, name, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || name || 'Purchase request',
        subtitle: `${name || ''} · ${count} item${count === 1 ? '' : 's'}`
      };
    }
  }
});
