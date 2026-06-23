import { NextResponse } from 'next/server';
import { listingRows } from '@/lib/mockData';
export async function GET(req: Request) { const url = new URL(req.url); const marketplace = url.searchParams.get('marketplace') === 'LAZADA' ? 'LAZADA' : 'SHOPEE'; return NextResponse.json({ items: listingRows(marketplace) }); }
export async function PATCH(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, updated: body }); }
