import { createClient } from '@supabase/supabase-js'

// Type definitions for database tables
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  subscription_plan?: 'starter' | 'pro' | 'ultra' | 'max'
  credits_remaining: number
  created_at: string
}

export interface GeneratedImage {
  id: string
  user_id: string
  image_url: string
  style: string
  background: string
  accessories: string
  created_at: string
}

// Lazy-load Supabase client to avoid build-time initialization errors
let supabaseClient: any = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      console.warn('Supabase credentials not configured')
      return null
    }
    
    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    console.warn('Supabase server credentials not configured')
    return null
  }
  
  return createClient(url, key)
}

// Keep backward compatibility
export const supabase = getSupabaseClient()
