import { createBrowserClient } from '@supabase/ssr';

// Use fallback values at build time — next-on-pages injects real values at runtime
// via CF Pages env vars, so process.env.NEXT_PUBLIC_* works correctly at runtime.
// During SSG pre-render, we use placeholders to avoid throwing (supabase is never
// called during pre-render since all auth calls are inside useEffect).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton for client components
export const supabase = createClient();
