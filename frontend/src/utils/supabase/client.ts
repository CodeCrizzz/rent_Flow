import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables! Check Vercel Settings.");
  }

  return createBrowserClient(url, key, {
    db: { schema: 'rentFlow_schema' }
  })
}