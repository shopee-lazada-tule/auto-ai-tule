import { NextResponse } from 'next/server';
import { buildActiveListingCsvRows, buildListingCsvRows, buildSoldCsvRows, listingCsvHeaders, toCsv, type ListingCsvType } from '@/lib/csv';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const marketplace = body.marketplace === 'LAZADA' ? 'LAZADA' : 'SHOPEE';
  const type = body.type ?? 'NEW_LISTING';
  let rows;
  if (type === 'ACTIVE_LISTINGS') rows = buildActiveListingCsvRows();
  else if (type === 'SOLD_ITEMS') rows = buildSoldCsvRows();
  else rows = await buildListingCsvRows(marketplace, (type === 'NEED_CHECK_ONLY' || type === 'ERROR_ONLY' ? type : 'NEW_LISTING') as ListingCsvType);
  const headers = type === 'NEW_LISTING' || type === 'NEED_CHECK_ONLY' || type === 'ERROR_ONLY' ? listingCsvHeaders() : undefined;
  return new NextResponse(toCsv(rows, headers), { headers: { 'content-type': 'text/csv; charset=utf-8' } });
}
