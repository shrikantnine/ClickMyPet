-- PetPX Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN SETTINGS TABLE
-- ============================================

-- Store global admin settings (e.g., enable/disable visitor tracking)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.admin_settings (key, value, description)
VALUES ('visitor_tracking_enabled', 'true', 'Enable or disable visitor tracking system-wide')
ON CONFLICT (key) DO NOTHING;

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON public.admin_settings(key);

-- ============================================
-- FREE TRIAL TRACKING TABLES (Anti-Abuse)
-- ============================================

-- Track free trial usage by email and IP to prevent abuse
CREATE TABLE IF NOT EXISTS public.user_trials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  job_id TEXT,
  style TEXT,
  background TEXT,
  accessory TEXT,
  image_url TEXT,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_trials_email ON public.user_trials(email);
CREATE INDEX IF NOT EXISTS idx_user_trials_ip ON public.user_trials(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_trials_verified ON public.user_trials(email_verified);

-- User events table for analytics and tracking
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- 'cta_clicked', 'signup_started', 'upload_completed', 'generation_started', etc.
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  ip_address TEXT,
  metadata JSONB, -- Store additional event data
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_user_events_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON public.user_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_email ON public.user_events(email);

-- ============================================
-- VISITOR TRACKING TABLES (Marketing & Retargeting)
-- ============================================

-- Comprehensive visitor tracking for all website visitors
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT UNIQUE NOT NULL, -- Format: yyyymmddhhmmss_randomstring
  
  -- Identity Information
  email TEXT, -- Populated when user provides email
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Technical Data
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  device_fingerprint TEXT, -- Unique device identifier
  
  -- Browser & Device Info
  browser_name TEXT,
  browser_version TEXT,
  os_name TEXT,
  os_version TEXT,
  device_type TEXT, -- mobile, tablet, desktop
  screen_resolution TEXT,
  viewport_size TEXT,
  color_depth INTEGER,
  pixel_ratio NUMERIC,
  touch_support BOOLEAN,
  
  -- Location & Language
  timezone TEXT,
  language TEXT,
  languages JSONB, -- Array of all accepted languages
  country TEXT,
  city TEXT,
  
  -- Cookies & Storage Data (GDPR compliant - store with consent)
  cookies JSONB, -- All cookies data
  local_storage JSONB, -- localStorage data
  session_storage JSONB, -- sessionStorage data
  
  -- Traffic Source
  referrer TEXT,
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Behavioral Data
  pages_visited JSONB DEFAULT '[]'::jsonb, -- Array of page visits with timestamps
  time_on_site INTEGER, -- Total seconds
  page_views INTEGER DEFAULT 1,
  session_count INTEGER DEFAULT 1,
  
  -- Engagement Metrics
  cta_clicks JSONB DEFAULT '[]'::jsonb, -- Which CTAs clicked
  scroll_depth INTEGER, -- Max scroll percentage
  interactions JSONB DEFAULT '[]'::jsonb, -- All user interactions
  
  -- Conversion Data
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT, -- 'free_trial', 'paid_subscription', etc.
  conversion_value NUMERIC,
  
  -- Timestamps
  first_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitor sessions - track individual sessions
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL REFERENCES public.visitors(visitor_id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  
  -- Session Info
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- seconds
  
  -- Session Data
  pages_visited JSONB DEFAULT '[]'::jsonb,
  events JSONB DEFAULT '[]'::jsonb,
  ip_address TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page views - detailed page tracking
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL REFERENCES public.visitors(visitor_id) ON DELETE CASCADE,
  session_id TEXT REFERENCES public.visitor_sessions(session_id) ON DELETE CASCADE,
  
  -- Page Info
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  
  -- Engagement
  time_on_page INTEGER, -- seconds
  scroll_depth INTEGER, -- percentage
  interactions JSONB DEFAULT '[]'::jsonb,
  
  -- Exit tracking
  exit_page BOOLEAN DEFAULT FALSE,
  bounce BOOLEAN DEFAULT FALSE,
  
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON public.visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_email ON public.visitors(email);
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON public.visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_converted ON public.visitors(converted);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON public.visitors(first_visit DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON public.visitors(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor ON public.visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_started ON public.visitor_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed ON public.page_views(viewed_at DESC);

-- ============================================
-- EXISTING TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('starter', 'pro', 'max')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
  images_remaining INTEGER NOT NULL,
  images_total INTEGER NOT NULL,
  style_options INTEGER NOT NULL,
  background_options INTEGER NOT NULL,
  resolution TEXT NOT NULL,
  has_accessories BOOLEAN DEFAULT FALSE,
  has_custom_requests BOOLEAN DEFAULT FALSE,
  has_commercial_rights BOOLEAN DEFAULT FALSE,
  has_priority_support BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, started_at) -- One active subscription per user at a time
);

-- Payments table (stores Razorpay payment records)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('starter', 'pro', 'max')),
  amount INTEGER NOT NULL, -- Amount in cents (USD) or smallest currency unit
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'refunded')) DEFAULT 'created',
  payment_method TEXT,
  refund_amount INTEGER DEFAULT 0,
  refund_status TEXT,
  metadata JSONB, -- Store additional Razorpay metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table (stores onboarding selections)
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_styles TEXT[] DEFAULT '{}',
  preferred_backgrounds TEXT[] DEFAULT '{}',
  preferred_accessories TEXT[] DEFAULT '{}',
  pet_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Generated images table
CREATE TABLE IF NOT EXISTS public.generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  pet_type TEXT,
  pet_breed TEXT,
  style TEXT NOT NULL,
  background TEXT NOT NULL,
  accessories TEXT[] DEFAULT '{}',
  prompt TEXT,
  negative_prompt TEXT,
  generation_params JSONB,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')) DEFAULT 'processing',
  jobs_data JSONB,
  image_urls TEXT[],
  error_message TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics tables for admin dashboard

-- Track each image generation request
CREATE TABLE IF NOT EXISTS public.analytics_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  pet_type TEXT,
  pet_breed TEXT,
  style TEXT NOT NULL,
  background TEXT NOT NULL,
  accessories TEXT[] DEFAULT '{}',
  num_images INTEGER NOT NULL,
  estimated_time INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track user activity
CREATE TABLE IF NOT EXISTS public.analytics_user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track page views
CREATE TABLE IF NOT EXISTS public.analytics_page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  page TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track subscription events
CREATE TABLE IF NOT EXISTS public.analytics_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'upgraded', 'cancelled', 'expired')),
  plan_id TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggregated statistics tables for faster dashboard queries

-- Style popularity stats
CREATE TABLE IF NOT EXISTS public.analytics_style_stats (
  style TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Background popularity stats
CREATE TABLE IF NOT EXISTS public.analytics_background_stats (
  background TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accessory popularity stats
CREATE TABLE IF NOT EXISTS public.analytics_accessory_stats (
  accessory TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_generated_images_user_id ON public.generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_subscription_id ON public.generated_images(subscription_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON public.generated_images(status);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_timestamp ON public.analytics_generations(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_user_id ON public.analytics_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_style ON public.analytics_generations(style);
CREATE INDEX IF NOT EXISTS idx_analytics_generations_background ON public.analytics_generations(background);
CREATE INDEX IF NOT EXISTS idx_analytics_user_activity_timestamp ON public.analytics_user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp ON public.analytics_page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_subscriptions_timestamp ON public.analytics_subscriptions(timestamp);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_style_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_background_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_accessory_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions table policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (false); -- Only through server-side functions

CREATE POLICY "Only system can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (false); -- Only through server-side functions

-- Payments table policies
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can manage payments"
  ON public.payments FOR ALL
  USING (false); -- Only through server-side functions

-- User preferences table policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Generated images table policies
CREATE POLICY "Users can view own images"
  ON public.generated_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Only system can insert images"
  ON public.generated_images FOR INSERT
  WITH CHECK (false); -- Only through server-side functions

-- Functions for subscription management

-- Function to create a new subscription after successful payment
CREATE OR REPLACE FUNCTION create_subscription_from_payment(
  p_user_id UUID,
  p_payment_id UUID,
  p_plan_id TEXT,
  p_images_total INTEGER,
  p_style_options INTEGER,
  p_background_options INTEGER,
  p_resolution TEXT,
  p_has_accessories BOOLEAN,
  p_has_custom_requests BOOLEAN,
  p_has_commercial_rights BOOLEAN,
  p_has_priority_support BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_subscription_id UUID;
BEGIN
  -- Insert new subscription
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    status,
    images_remaining,
    images_total,
    style_options,
    background_options,
    resolution,
    has_accessories,
    has_custom_requests,
    has_commercial_rights,
    has_priority_support,
    expires_at
  ) VALUES (
    p_user_id,
    p_plan_id,
    'active',
    p_images_total,
    p_images_total,
    p_style_options,
    p_background_options,
    p_resolution,
    p_has_accessories,
    p_has_custom_requests,
    p_has_commercial_rights,
    p_has_priority_support,
    NOW() + INTERVAL '1 year' -- Subscriptions valid for 1 year
  )
  RETURNING id INTO v_subscription_id;
  
  RETURN v_subscription_id;
END;
$$;

-- Function to decrement image count after generation
CREATE OR REPLACE FUNCTION decrement_image_count(
  p_subscription_id UUID,
  p_count INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscriptions
  SET 
    images_remaining = images_remaining - p_count,
    updated_at = NOW()
  WHERE 
    id = p_subscription_id 
    AND images_remaining >= p_count
    AND status = 'active';
  
  RETURN FOUND;
END;
$$;

-- Analytics helper functions

-- Increment style count
CREATE OR REPLACE FUNCTION increment_style_count(p_style TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.analytics_style_stats (style, count, updated_at)
  VALUES (p_style, 1, NOW())
  ON CONFLICT (style)
  DO UPDATE SET 
    count = analytics_style_stats.count + 1,
    updated_at = NOW();
END;
$$;

-- Increment background count
CREATE OR REPLACE FUNCTION increment_background_count(p_background TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.analytics_background_stats (background, count, updated_at)
  VALUES (p_background, 1, NOW())
  ON CONFLICT (background)
  DO UPDATE SET 
    count = analytics_background_stats.count + 1,
    updated_at = NOW();
END;
$$;

-- Increment accessory count
CREATE OR REPLACE FUNCTION increment_accessory_count(p_accessory TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.analytics_accessory_stats (accessory, count, updated_at)
  VALUES (p_accessory, 1, NOW())
  ON CONFLICT (accessory)
  DO UPDATE SET 
    count = analytics_accessory_stats.count + 1,
    updated_at = NOW();
END;
$$;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
