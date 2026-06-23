import { NextResponse } from 'next/server';
import { messageThreads } from '@/lib/mockData';
export async function GET() { return NextResponse.json({ items: messageThreads }); }
