import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'purchaseRequest',
  title: 'Purchase Request',
  type: 'document',
  groups: [
    { name: 'order', title: 'Order', default: true },
    { name: 'customer', title: 'Customer & delivery' },
    { name: 'status', title: 'Status' },
    { name: 'payment', title: 'Payment (Stripe)' }
  ],
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order number',
      type: 'string',
      description: 'Generated automatically when the request is submitted, e.g. ST-20260915-A1B2.',
      group: 'order'
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      group: 'order',
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
              description: 'Set automatically when the request is submitted. Used to auto-mark the product as Sold once payment succeeds.'
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
    defineField({
      name: 'shippingMethod',
      title: 'Shipping method',
      type: 'string',
      group: 'order',
      description: 'e.g. "NZ Post — Standard". Set automatically at checkout.'
    }),
    defineField({
      name: 'shippingCost',
      title: 'Shipping cost (NZD)',
      type: 'number',
      group: 'order',
      description: 'Set automatically at checkout. 0 for free shipping.'
    }),
    defineField({
      name: 'buyerMember',
      title: 'My Siren account',
      type: 'reference',
      to: [{ type: 'member' }],
      group: 'customer',
      readOnly: true,
      description:
        'Set automatically to whichever account was logged in when this order was placed. Used to show the order in that account\'s "My Siren" purchase history, regardless of the name/email typed into the checkout form itself.'
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'customer' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'customer' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp / Phone', type: 'string', group: 'customer' }),
    defineField({
      name: 'deliveryFirstName',
      title: 'First name',
      type: 'string',
      group: 'customer'
    }),
    defineField({
      name: 'deliveryLastName',
      title: 'Last name',
      type: 'string',
      group: 'customer'
    }),
    defineField({
      name: 'deliveryCompany',
      title: 'Company (optional)',
      type: 'string',
      group: 'customer'
    }),
    defineField({ name: 'deliveryAddress', title: 'Address', type: 'string', group: 'customer' }),
    defineField({ name: 'deliveryCity', title: 'City', type: 'string', group: 'customer' }),
    defineField({ name: 'deliveryRegion', title: 'Region', type: 'string', group: 'customer' }),
    defineField({
      name: 'deliveryPostalCode',
      title: 'Postal code',
      type: 'string',
      group: 'customer'
    }),
    defineField({ name: 'country', title: 'Country', type: 'string', group: 'customer' }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping address (legacy, combined)',
      type: 'text',
      rows: 3,
      group: 'customer',
      description: 'Older orders stored the full address as one block of text here instead of separate fields above.'
    }),
    defineField({ name: 'message', title: 'Customer notes', type: 'text', rows: 4, group: 'customer' }),
    defineField({ name: 'trackingNumber', title: 'NZ Post tracking number', type: 'string', group: 'status' }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' }
        ],
        layout: 'radio'
      },
      initialValue: 'pending',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Processing', value: 'processing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' }
        ],
        layout: 'radio'
      },
      initialValue: 'new',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'shippingStatus',
      title: 'Shipping status',
      type: 'string',
      group: 'status',
      options: {
        list: [
          { title: 'Not shipped', value: 'not_shipped' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' }
        ],
        layout: 'radio'
      },
      initialValue: 'not_shipped',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Checkout session ID',
      type: 'string',
      group: 'payment',
      description: 'Set automatically once the customer starts checkout. Used to match the payment webhook to this order.',
      readOnly: true
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Stripe payment ID',
      type: 'string',
      group: 'payment',
      description: 'Set automatically once payment succeeds. Look this ID up in the Stripe Dashboard for full payment details.',
      readOnly: true
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid at',
      type: 'datetime',
      group: 'payment',
      readOnly: true
    }),
    defineField({ name: 'submittedAt', title: 'Submitted at', type: 'datetime', group: 'order' })
  ],
  orderings: [
    { title: 'Newest first', name: 'submittedDesc', by: [{ field: 'submittedAt', direction: 'desc' }] }
  ],
  preview: {
    select: { title: 'orderNumber', name: 'name', items: 'items', paymentStatus: 'paymentStatus' },
    prepare({ title, name, items, paymentStatus }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || name || 'Purchase request',
        subtitle: `${name || ''} · ${count} item${count === 1 ? '' : 's'} · ${paymentStatus || 'pending'}`
      };
    }
  }
});
