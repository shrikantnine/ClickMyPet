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

// Initialize Supabase client
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!url || !key) {
  console.warn('⚠️ Supabase credentials not configured. Auth features will not work.')
}

export const supabase = url && key ? createClient(url, key) : null

export function getSupabaseClient() {
  return supabase
}

export function getSupabaseServerClient() {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serverUrl || !serverKey) {
    console.warn('Supabase server credentials not configured')
    return null
  }
  
  return createClient(serverUrl, serverKey)
}
