import { groq } from 'next-sanity';
import { client, hasSanityConfig } from './client';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  brandName, tagline, instagramUrl, tiktokUrl, whatsappUrl, xiaohongshuUrl, douyinUrl, wechatHandle, email
}`;

export const homepageQuery = groq`*[_type == "homepage"][0]{
  hero{ eyebrow, title, body, ctaLabel, "bgUrl": background.asset->url, "bgAlt": background.alt },
  newArrivals{ "images": images[].asset->url },
  philosophy{ sectionLabel, sectionTitle, "videoUrl": backgroundVideo.asset->url, pillars[]{ title, body } },
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
  "images": images[]{ "url": asset->url, alt },
  "videoUrl": video.asset->url
}`;

export const shopProductsQuery = groq`*[_type == "shopProduct"] | order(order asc, _createdAt desc){
  _id, name, slug, category, productLine, stone, price, status,
  "collectionTitle": collection->title,
  "images": images[]{ "url": asset->url, alt }
}`;

export const newArrivalProductsQuery = groq`*[_type == "shopProduct" && isNewArrival == true] | order(order asc, _createdAt desc){
  _id, name, slug, category, productLine, stone, price, status,
  "collectionTitle": collection->title,
  "images": images[]{ "url": asset->url, alt }
}`;

export const shopProductBySlugQuery = groq`*[_type == "shopProduct" && slug.current == $slug][0]{
  _id, name, slug, category, productLine, stone, price, status,
  material, length, craftedIn, stoneStory, pieceStory, materialsCare, packagingDescription,
  "packagingImageUrl": packagingImage.asset->url, "packagingImageAlt": packagingImage.alt,
  "collectionTitle": collection->title,
  "images": images[]{ "url": asset->url, alt }
}`;

export const bespokeRequestByIdQuery = groq`*[_type == "bespokeRequest" && _id == $id][0]{
  _id, name, productionTrack, pieceType, gender, birthday, zodiac,
  wristSize, ringSize, colours, styles, note, status, submittedAt
}`;

export const purchaseRequestByOrderNumberQuery = groq`*[_type == "purchaseRequest" && orderNumber == $orderNumber][0]{
  _id, orderNumber,
  "items": items[]{
    productName, price, wristSize, ringSize,
    "imageUrl": product->images[0].asset->url
  },
  shippingMethod, shippingCost,
  deliveryAddress, deliveryCity, deliveryRegion, deliveryPostalCode, country
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
export const getNewArrivalProducts = () => safeFetch<any[]>(newArrivalProductsQuery);
export const getShopProductBySlug = (slug: string) => safeFetch<any>(shopProductBySlugQuery, { slug });
export const getBespokeRequestById = (id: string) => safeFetch<any>(bespokeRequestByIdQuery, { id });
export const getPurchaseRequestByOrderNumber = (orderNumber: string) =>
  safeFetch<any>(purchaseRequestByOrderNumberQuery, { orderNumber });
