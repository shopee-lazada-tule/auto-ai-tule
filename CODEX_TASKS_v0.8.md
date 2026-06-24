import { NextResponse } from 'next/server';
import { countriesByMarketplace } from '@/lib/constants';
export async function GET() { return NextResponse.json(countriesByMarketplace); }
