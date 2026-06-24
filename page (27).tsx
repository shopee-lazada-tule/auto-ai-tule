import { NextResponse } from 'next/server';
import { generateListingDrafts } from '@/lib/store';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await generateListingDrafts(body);
  return NextResponse.json({ ok: true, ...result });
}
