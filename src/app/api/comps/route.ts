import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Fetch from Supabase
  return NextResponse.json({ comps: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, is_public, tip_deadline } = body;

    if (!name) {
      return NextResponse.json({ error: 'Comp name is required' }, { status: 400 });
    }

    const invite_code = name.replace(/[^a-zA-Z]/g, '').substring(0, 6).toUpperCase() + Math.floor(Math.random() * 100);

    // TODO: Save to Supabase
    return NextResponse.json({
      comp: {
        id: 'demo-' + Date.now(),
        name,
        description,
        is_public,
        invite_code,
        tip_deadline,
        season_year: 2026,
        created_at: new Date().toISOString(),
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create comp' }, { status: 500 });
  }
}