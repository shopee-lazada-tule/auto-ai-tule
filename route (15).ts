import { NextResponse } from 'next/server';
import { buildActiveListingCsvRows, buildListingCsvRows, buildSoldCsvRows, toCsv } from '@/lib/csv';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const marketplace = body.marketplace === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
  const type = body.type ?? 'NEW_LISTING';
  let rows;
  if (type === 'ACTIVE_LISTINGS') rows = buildActiveListingCsvRows();
  else if (type === 'SOLD_ITEMS') rows = buildSoldCsvRows();
  else rows = buildListingCsvRows(marketplace);
  return new NextResponse(toCsv(rows), { headers: { 'content-type': 'text/csv; charset=utf-8' } });
}
