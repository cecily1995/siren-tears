import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const runtime = 'nodejs';

function getReadClient() {
  if (!projectId || !dataset) return null;
  // A read-only client is enough here (no token) since the public dataset
  // is readable; we still only ever look up the ONE record matching the
  // verified session's own id, never anything the caller supplies.
  return createClient({ apiVersion, dataset, projectId, useCdn: false });
}

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ ok: true, member: null });
  }

  const client = getReadClient();
  if (!client) {
    return NextResponse.json({ ok: true, member: null });
  }

  try {
    const member = await client.fetch(
      `*[_type == "member" && _id == $id][0]{
        firstName, lastName, email, phoneCountryCode, phone, addressLine, city, postcode, country, birthday, memberCode, tier, isMember, joinedAt
      }`,
      { id: session.id }
    );

    if (!member) {
      return NextResponse.json({ ok: true, member: null });
    }

    const [purchases, bespokeRequests] = await Promise.all([
      client.fetch(
        `*[_type == "purchaseRequest" && paymentStatus == "paid" && (buyerMember._ref == $memberId || lower(email) == lower($email))] | order(_createdAt desc){
          _id, orderNumber,
          "productName": items[0].productName,
          "itemCount": count(items),
          "items": items[]{
            productName, price, wristSize, ringSize,
            "imageUrl": product->images[0].asset->url
          },
          shippingMethod, shippingCost,
          paymentStatus, orderStatus, shippingStatus, trackingNumber, _createdAt
        }`,
        { memberId: session.id, email: member.email }
      ),
      client.fetch(
        `*[_type == "bespokeRequest" && lower(email) == lower($email)] | order(_createdAt desc){
          _id, pieceType, status, _createdAt
        }`,
        { email: member.email }
      )
    ]);

    return NextResponse.json({ ok: true, member, purchases, bespokeRequests });
  } catch (err) {
    console.error('Session lookup failed', err);
    return NextResponse.json({ ok: true, member: null });
  }
}
