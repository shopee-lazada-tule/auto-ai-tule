import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const text = await req.text();
  const rows = text.trim() ? text.trim().split(/\r?\n/).length - 1 : 0;
  return NextResponse.json({ ok: true, mode: 'mock', importedRows: Math.max(rows, 0), message: 'DB接続後に実保存へ置き換えます。' });
}
