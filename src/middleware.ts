import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/create', '/profile'];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For now, we handle auth client-side via React state
  // When Supabase is connected, this middleware will check session cookies

  // Allow all requests through for now (demo mode)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
