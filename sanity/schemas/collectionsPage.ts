import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'collectionsPage',
  title: 'Collections Page',
  type: 'document',
  fields: [
    defineField({
      name: 'aotearoaBannerImage',
      title: 'Aotearoa banner image',
      type: 'image',
      options: { hotspot: true },
      description:
        "Background photo for the Aotearoa (gemstone) banner on the Collections page. Separate from the homepage's own Aotearoa banner image -- changing one does not affect the other."
    })
  ]
});
