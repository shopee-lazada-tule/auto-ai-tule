import { NextResponse } from 'next/server';
export async function POST(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, mode: 'dry-run', checked: 24, stopped: 3, reasons: ['送料未入力', 'カテゴリ未設定', '価格急変'], request: body }); }
