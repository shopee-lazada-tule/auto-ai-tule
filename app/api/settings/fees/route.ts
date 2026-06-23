import { NextResponse } from 'next/server';
import { feeSettings } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ items: feeSettings }); }
export async function PUT(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, saved: body }); }
