import { NextResponse } from 'next/server';
import { listListingDrafts, updateListingDraftSelection } from '@/lib/store';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = await listListingDrafts(url.searchParams);
  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await updateListingDraftSelection(body);
  return NextResponse.json({ ok: true, ...result });
}
