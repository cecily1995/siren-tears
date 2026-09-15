'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { apiVersion, dataset, projectId } from './sanity/env';

export default defineConfig({
  basePath: '/studio',
  name: 'siren-tears-studio',
  title: 'SIREN TEARS — Content Studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Homepage')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem()
              .title('Brand Story')
              .child(S.document().schemaType('brandStory').documentId('brandStory')),
            S.divider(),
            S.documentTypeListItem('collection').title('Collections'),
            S.documentTypeListItem('product').title('Featured Products'),
            S.documentTypeListItem('journalArticle').title('Stone Journal'),
            S.divider(),
            S.documentTypeListItem('shopProduct').title('Shop Products'),
            S.documentTypeListItem('buyerShowcase').title('Buyer Showcase (As Worn)'),
            S.divider(),
            S.documentTypeListItem('purchaseRequest').title('Purchase Requests'),
            S.documentTypeListItem('orderEnquiry').title('Order Enquiries'),
            S.documentTypeListItem('chatEnquiry').title('Chat Enquiries'),
            S.documentTypeListItem('bespokeRequest').title('Bespoke Requests'),
            S.documentTypeListItem('member').title('Siren Circle Members')
          ])
    }),
    visionTool({ defaultApiVersion: apiVersion })
  ]
});
