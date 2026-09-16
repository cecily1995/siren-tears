import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const orderNumber = searchParams.get('orderNumber');

  if (secret !== process.env.ADMIN_DEBUG_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!orderNumber) {
    return NextResponse.json({ error: 'orderNumber required' }, { status: 400 });
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false
  });

  const order = await client.fetch(
    `*[_type == "purchaseRequest" && orderNumber == $orderNumber][0]{
      _id, orderNumber, email, name, paymentStatus, _createdAt, submittedAt,
      buyerMember, "buyerMemberExpanded": buyerMember->{_id, email, firstName, lastName}
    }`,
    { orderNumber }
  );

  return NextResponse.json({ order });
}
