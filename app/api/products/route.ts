import { NextResponse } from 'next/server';
import { products } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ items: products }); }
export async function POST(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, item: { id: 'mock_product', ...body } }, { status: 201 }); }
