import { NextResponse } from 'next/server';
import { activeListings } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ items: activeListings }); }
