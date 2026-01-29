import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates a Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * 
 * This client manages authentication state via Next.js cookies and works
 * seamlessly with the App Router.
 * 
 * @example
 * ```tsx
 * // In a Server Component
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export default async function Page() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('posts').select('*')
 *   return <div>{/* render data *\/}</div>
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // In a Server Action
 * 'use server'
 * 
 * import { createClient } from '@/lib/supabase/server'
 * 
 * export async function getPosts() {
 *   const supabase = await createClient()
 *   const { data, error } = await supabase.from('posts').select('*')
 *   return data
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // In a Route Handler
 * import { createClient } from '@/lib/supabase/server'
 * import { NextResponse } from 'next/server'
 * 
 * export async function GET() {
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('posts').select('*')
 *   return NextResponse.json(data)
 * }
 * ```
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  }) as unknown as SupabaseClient<Database>
}
