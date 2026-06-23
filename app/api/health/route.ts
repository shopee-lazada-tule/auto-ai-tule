import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ ok: true, service: 'shopee-lazada-listing-support-tool', version: '0.8.0' }); }
