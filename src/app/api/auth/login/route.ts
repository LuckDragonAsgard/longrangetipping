import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url') {
      // Real Supabase auth
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json({
        user: {
          id: data.user.id,
          email: data.user.email,
          display_name: data.user.user_metadata?.display_name || email.split('@')[0],
        },
        session: data.session,
      });
    }

    // Demo mode - accept any login
    return NextResponse.json({
      user: {
        id: 'demo-' + Date.now(),
        email,
        display_name: email.split('@')[0],
      },
      message: 'Demo mode - Supabase not configured',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
