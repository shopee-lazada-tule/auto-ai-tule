import { NextResponse } from 'next/server';
export async function POST(req: Request) { const body = await req.json().catch(() => ({})); return NextResponse.json({ ok: true, generatedCountries: body.marketplace === 'LAZADA' ? ['SG','MY','PH','TH','VN','ID'] : ['SG','MY','PH','TH','TW','VN'] }); }
