import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'brandName', title: 'Brand name', type: 'string', initialValue: 'SIREN TEARS' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'xiaohongshuUrl', title: 'Xiaohongshu URL', type: 'url' }),
    defineField({ name: 'wechatHandle', title: 'WeChat handle', type: 'string' }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' })
  ],
  preview: { select: { title: 'brandName' } }
});
