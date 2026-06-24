import { NextResponse } from 'next/server';
import { listProducts, saveProduct } from '@/lib/store';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = await listProducts(url.searchParams);
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  try {
    const result = await saveProduct(body);
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Invalid product' }, { status: 400 });
  }
}
