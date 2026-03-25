import { NextResponse } from 'next/server';

const SQUIGGLE_BASE = 'https://api.squiggle.com.au';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'teams';
  const year = searchParams.get('year') || '2026';
  const round = searchParams.get('round') || '';

  let url = `${SQUIGGLE_BASE}/?q=${query};year=${year}`;
  if (round) url += `;round=${round}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LongRangeTipping/1.0 (longrangetipping.com)' },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from Squiggle' }, { status: 500 });
  }
}