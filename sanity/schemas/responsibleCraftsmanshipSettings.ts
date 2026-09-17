import { defineField, defineType } from 'sanity';

const sections = [
  { name: 'craftedWithIntention', title: 'Crafted With Intention (opening)' },
  { name: 'naturalMaterials', title: 'Natural Materials' },
  { name: 'madeByHand', title: 'Made By Hand' },
  { name: 'madeToOrder', title: 'Made To Order' },
  { name: 'oneOfOne', title: 'One Of One' },
  { name: 'responsibleByDesign', title: 'Responsible By Design' },
  { name: 'signaturePackaging', title: 'Signature Packaging' }
];

export default defineType({
  name: 'responsibleCraftsmanshipSettings',
  title: 'Responsible Craftsmanship — Media',
  type: 'document',
  description: 'One photo per section of the Responsible Craftsmanship page. Copy text lives in the site translations, not here.',
  fields: sections.map((s) =>
    defineField({
      name: `${s.name}Image`,
      title: `${s.title} — photo`,
      type: 'image',
      options: { hotspot: true }
    })
  )
});
