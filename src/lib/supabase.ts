import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  subscription_plan?: 'starter' | 'pro' | 'max'
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