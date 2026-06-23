import { NextResponse } from 'next/server';
import { salesSummary } from '@/lib/mockData';
export async function GET() { return NextResponse.json(salesSummary); }
