import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const database = await checkDatabaseHealth();
  return NextResponse.json({
    ok: true,
    service: 'shopee-lazada-listing-support-tool',
    version: '1.0.0-mock',
    ...database,
  });
}
