import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || 'NZ';
  return NextResponse.json({ country: country.toUpperCase() });
}
