import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json({ lockTiming: 'SHIPPED' }); }
export async function PUT(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, saved: body }); }
