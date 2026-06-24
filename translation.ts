import { NextResponse } from 'next/server';
import { soldItems } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ items: soldItems }); }
