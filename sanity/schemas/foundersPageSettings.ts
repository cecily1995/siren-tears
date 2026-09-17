import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'foundersPageSettings',
  title: 'Founders Page — Media',
  type: 'document',
  description: 'Photos and video for the "The People Behind Siren Tears" page. Copy text lives in the site translations, not here -- this is images/video only.',
  fields: [
    defineField({
      name: 'introImage',
      title: 'Opening photo (3:4)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'video',
      title: 'Quote video (4:5)',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'The quote text and signature are overlaid by the website, not part of the video file -- swapping this video never removes them.'
    }),
    defineField({
      name: 'groupPhoto',
      title: 'Founders group photo (3:4)',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'squareImages',
      title: 'Square image strip (1:1 each)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Add as many as you like -- shown in an auto-scrolling, swipeable row.'
    }),
    defineField({
      name: 'finalBannerImage',
      title: 'Final banner photo (mobile 4:5 / desktop 16:9)',
      type: 'image',
      options: { hotspot: true }
    })
  ]
});
