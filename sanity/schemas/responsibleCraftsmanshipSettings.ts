import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'responsibleCraftsmanshipSettings',
  title: 'Responsible Craftsmanship — Media',
  type: 'document',
  description: 'Photos for the Responsible Craftsmanship page. Copy text lives in the site translations, not here.',
  fields: [
    defineField({
      name: 'craftedWithIntentionImage',
      title: 'Opening photo (3:4, narrower)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'naturalMaterialsImages',
      title: 'Natural Materials photos (3:4, wider -- "Natural Materials" text is overlaid by the site)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Add as many as you like -- they cross-fade on a loop, and can also be swiped through manually.'
    }),
    defineField({
      name: 'squareImages',
      title: 'Square image strip (1:1 each)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Shown in an auto-scrolling, swipeable row between "Made To Order" and "One Of One".'
    }),
    defineField({
      name: 'oneOfOneVideo',
      title: 'One Of One video (16:9, full-bleed, no side margin)',
      type: 'file',
      options: { accept: 'video/*' }
    }),
    defineField({
      name: 'signaturePackagingImage',
      title: 'Signature Packaging photo (paired beside the text, on its left)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'responsibleByDesignImage',
      title: 'Responsible By Design photo (3:4, narrow side margin -- "Responsible By Design" text is overlaid on this by the site)',
      type: 'image',
      options: { hotspot: true }
    })
  ]
});
