import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service role key.
  * ONLY use in API routes / server actions — never import from client components.
   */
   export function createServerClient() {
     const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
       const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

         if (!url || !serviceKey) {
             throw new Error(
                   'Missing server Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
                       );
                         }

                           return createClient(url, serviceKey);
                           }
                           