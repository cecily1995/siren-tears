'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { apiVersion, dataset, projectId } from './sanity/env';
import { markProductsSoldAction } from './sanity/actions/markProductsSoldAction';
import { notifyShippedAction } from './sanity/actions/notifyShippedAction';

export default defineConfig({
  basePath: '/studio',
  name: 'siren-tears-studio',
  title: 'SIREN TEARS — Content Studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      context.schemaType === 'purchaseRequest' ? [...prev, markProductsSoldAction, notifyShippedAction] : prev
  },
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
              .title('Collections Page')
              .child(S.document().schemaType('collectionsPage').documentId('collectionsPage')),
            S.listItem()
              .title('Founders Page — Media')
              .child(S.document().schemaType('foundersPageSettings').documentId('foundersPageSettings')),
            S.listItem()
              .title('Responsible Craftsmanship — Media')
              .child(
                S.document()
                  .schemaType('responsibleCraftsmanshipSettings')
                  .documentId('responsibleCraftsmanshipSettings')
              ),
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
