import { groq } from 'next-sanity';
import { client, hasSanityConfig } from './client';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  brandName, tagline, instagramUrl, xiaohongshuUrl, wechatHandle, email
}`;

export const homepageQuery = groq`*[_type == "homepage"][0]{
  hero{ eyebrow, title, body, ctaLabel, "bgUrl": background.asset->url, "bgAlt": background.alt },
  philosophy{ sectionLabel, sectionTitle, pillars[]{ title, body } },
  featured->{
    title, subtitle, body,
    "imageUrl": image.asset->url, "imageAlt": image.alt,
    stoneTitle, stoneBody,
    materialTitle, materialBody,
    stylingTitle, stylingBody,
    "detailUrl": detail.asset->url
  }
}`;

export const collectionsQuery = groq`*[_type == "collection"] | order(order asc){
  _id, title, subtitle, slug,
  "coverUrl": cover.asset->url, "coverAlt": cover.alt,
  scale
}`;

export const journalQuery = groq`*[_type == "journalArticle"] | order(publishedAt desc){
  _id, title, slug, category, excerpt, publishedAt,
  "coverUrl": cover.asset->url, "coverAlt": cover.alt
}`;

export const brandStoryQuery = groq`*[_type == "brandStory"][0]{
  eyebrow, title, paragraphs,
  "imageUrl": image.asset->url, "imageAlt": image.alt,
  stats[]{ label, value }
}`;

export const buyerShowcaseQuery = groq`*[_type == "buyerShowcase"] | order(order asc, _createdAt desc){
  _id, caption, customerHandle,
  "imageUrl": image.asset->url, "imageAlt": image.alt
}`;

export const shopProductsQuery = groq`*[_type == "shopProduct"] | order(order asc, _createdAt desc){
  _id, name, slug, category, stone, price, status,
  "collectionTitle": collection->title,
  "images": images[]{ "url": asset->url, alt }
}`;

export const shopProductBySlugQuery = groq`*[_type == "shopProduct" && slug.current == $slug][0]{
  _id, name, slug, category, stone, price, status,
  material, length, craftedIn, stoneStory, pieceStory,
  "collectionTitle": collection->title,
  "images": images[]{ "url": asset->url, alt }
}`;

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!hasSanityConfig || !client) return null;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch {
    return null;
  }
}

export const getSiteSettings = () => safeFetch<any>(siteSettingsQuery);
export const getHomepage = () => safeFetch<any>(homepageQuery);
export const getCollections = () => safeFetch<any[]>(collectionsQuery);
export const getJournal = () => safeFetch<any[]>(journalQuery);
export const getBrandStory = () => safeFetch<any>(brandStoryQuery);
export const getBuyerShowcase = () => safeFetch<any[]>(buyerShowcaseQuery);
export const getShopProducts = () => safeFetch<any[]>(shopProductsQuery);
export const getShopProductBySlug = (slug: string) => safeFetch<any>(shopProductBySlugQuery, { slug });
