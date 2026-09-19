import { NextResponse } from 'next/server';
import { getLiveNzdRates } from '@/lib/currency';

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({ base: 'NZD', rates: await getLiveNzdRates() });
}
