import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string', initialValue: 'SIREN TEARS' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({
      name: 'announcementItems',
      title: 'Homepage announcement bar',
      description: 'These messages rotate automatically. The whole message is clickable.',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'text', title: 'Advertisement text', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'href', title: 'Link', type: 'string', description: 'Examples: /new-arrivals or /shop?line=aotearoa', validation: (r) => r.required() })
        ],
        preview: { select: { title: 'text', subtitle: 'href' } }
      }],
      initialValue: [
        { _type: 'object', text: 'NEW ONE-OF-ONE ARRIVALS | SHOP NOW', href: '/new-arrivals' },
        { _type: 'object', text: 'FIND THE STONE OF YOUR MONTH | SHOP BIRTHSTONES', href: '/shop?q=birthstone' },
        { _type: 'object', text: 'AOTEAROA GEMSTONE JEWELLERY | WORN BY THE SEA', href: '/shop?line=aotearoa' }
      ]
    }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'tiktokUrl', title: 'TikTok URL', type: 'url' }),
    defineField({ name: 'whatsappUrl', title: 'WhatsApp link (wa.me/...)', type: 'url' }),
    defineField({ name: 'xiaohongshuUrl', title: 'RedNote (Xiaohongshu) URL', type: 'url' }),
    defineField({ name: 'douyinUrl', title: 'Douyin URL', type: 'url' }),
    defineField({ name: 'wechatHandle', title: 'WeChat handle', type: 'string' }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' })
  ],
  preview: { select: { title: 'brandName' } }
});
