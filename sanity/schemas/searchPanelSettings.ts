import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'searchPanelSettings',
  title: 'Mobile Search Panel — Media',
  type: 'document',
  description: 'The four promotional tile photos shown in the mobile search panel, below the suggested search terms.',
  fields: [
    defineField({
      name: 'tiles',
      title: 'Tiles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title shown on the tile' },
            { name: 'ctaLabel', type: 'string', title: 'Button label (e.g. "Shop Now", "Discover")' },
            { name: 'href', type: 'string', title: 'Link (e.g. /new-arrivals, /shop?line=aotearoa)' },
            { name: 'image', type: 'image', title: 'Photo', options: { hotspot: true } }
          ]
        }
      ],
      validation: (r) => r.max(4)
    })
  ]
});
