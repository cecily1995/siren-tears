/**
 * Seeds the three SIREN TEARS collections into Sanity.
 * Run with:
 *   node --env-file=.env.local scripts/seed-collections.mjs
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local (Editor permissions).
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    'Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-09-01',
  token,
  useCdn: false
});

const collections = [
  {
    _id: 'collection-last-queen',
    _type: 'collection',
    title: 'LAST QUEEN',
    slug: { _type: 'slug', current: 'last-queen' },
    subtitle: '',
    scale: 'tall',
    order: 1
  },
  {
    _id: 'collection-golden-age',
    _type: 'collection',
    title: 'GOLDEN AGE',
    slug: { _type: 'slug', current: 'golden-age' },
    subtitle: '',
    scale: 'wide',
    order: 2
  },
  {
    _id: 'collection-sirens-chain',
    _type: 'collection',
    title: "SIREN'S CHAIN",
    slug: { _type: 'slug', current: 'sirens-chain' },
    subtitle: '',
    scale: 'large',
    order: 3
  }
];

console.log(`Seeding ${collections.length} collections into project "${projectId}"...\n`);

for (const doc of collections) {
  try {
    const res = await client.createOrReplace(doc);
    console.log(`  ✓  ${res.title.padEnd(16)}  →  /collections/${doc.slug.current}`);
  } catch (err) {
    console.error(`  ✗  ${doc.title}: ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\nDone. Open http://localhost:3000/studio → Collections to see them.');
