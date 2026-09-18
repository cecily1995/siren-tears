import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPageSettings',
  title: 'Contact / Enquire Page — Media',
  type: 'document',
  description: 'The five entry-tile photos on the Enquire page (Shipping & Delivery, Care, FAQ, Size Guide, Returns/Repairs/Recycling).',
  fields: [
    defineField({ name: 'shippingImage', title: 'Shipping & Delivery photo (3:4)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'careImage', title: 'Care photo (3:4)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'faqImage', title: 'FAQ photo (3:4)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sizeGuideImage', title: 'Size Guide photo (3:4)', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'returnsImage',
      title: 'Returns, Repairs & Recycling photo (16:9)',
      type: 'image',
      options: { hotspot: true }
    })
  ]
});
