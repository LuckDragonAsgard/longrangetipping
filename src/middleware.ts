import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via Supabase session.
// This middleware is a no-op kept for future server-side auth checks.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
  }

  export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
    };
    