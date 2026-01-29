import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates a Supabase client for use in Next.js proxy.
 * 
 * This client is designed to work with the proxy's request/response
 * objects and can be used to protect routes and refresh auth tokens.
 * 
 * @example
 * ```ts
 * // proxy.ts
 * import { createClient } from '@/lib/supabase/middleware'
 * import { NextResponse } from 'next/server'
 * import type { NextRequest } from 'next/server'
 * 
 * export async function proxy(request: NextRequest) {
 *   const supabase = createClient(request)
 *   const { data: { session } } = await supabase.auth.getSession()
 * 
 *   if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 * 
 *   return NextResponse.next()
 * }
 * ```
 */
export function createClient(request: NextRequest): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  return supabase
}
