/**
 * Supabase client utilities for Next.js App Router
 *
 * This module provides pre-configured Supabase clients for different
 * contexts in your Next.js application.
 *
 * @module lib/supabase
 */

// Client-side client (for Client Components)
export { createClient as createBrowserClient } from "./client";

// Server-side client (for Server Components, Server Actions, Route Handlers)
export { createClient as createServerClient } from "./server";

// Proxy client (for Next.js proxy)
export { createClient as createMiddlewareClient } from "./middleware";

// Types - re-export from their sources
export type {
  SupabaseClient,
  User,
  Session,
  AuthError,
} from "@supabase/supabase-js";
