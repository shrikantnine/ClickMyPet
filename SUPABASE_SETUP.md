# Supabase Production Setup Guide

Complete setup guide for **Click My Pet** production deployment on `www.clickmypet.com`.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Supabase Project Configuration](#2-supabase-project-configuration)
3. [Database Schema Setup](#3-database-schema-setup)
4. [Authentication Providers](#4-authentication-providers)
5. [Environment Variables](#5-environment-variables)
6. [Row Level Security (RLS)](#6-row-level-security-rls)
7. [Storage Buckets](#7-storage-buckets)
8. [Production Checklist](#8-production-checklist)

---

## 1. Prerequisites

- [ ] Supabase account with Pro plan (recommended for production)
- [ ] Domain `www.clickmypet.com` configured and pointing to Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Google Cloud Console access
- [ ] Meta Developer account access

---

## 2. Supabase Project Configuration

### 2.1 Create Production Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Configure:
   - **Name**: `clickmypet-production`
   - **Database Password**: Generate a strong password (save securely!)
   - **Region**: Choose closest to your primary user base
   - **Plan**: Pro (recommended for production)

### 2.2 Get API Credentials

Navigate to **Settings → API** and copy:

| Key | Usage | Where to Store |
|-----|-------|----------------|
| `Project URL` | `NEXT_PUBLIC_SUPABASE_URL` | Vercel Environment Variables |
| `anon public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel Environment Variables |
| `service_role` | `SUPABASE_SERVICE_ROLE_KEY` | Vercel Environment Variables (Secret) |

⚠️ **CRITICAL**: Never expose `service_role` key in client-side code!

---

## 3. Database Schema Setup

### 3.1 Run Schema Migration

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy entire contents of `database/schema.sql`
3. Execute the SQL
4. Verify all tables are created

### 3.2 Core Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | Extended user profiles (linked to auth.users) |
| `subscriptions` | User subscription plans and limits |
| `payments` | Razorpay payment records |
| `generated_images` | AI-generated image records |
| `user_preferences` | Onboarding selections (styles, backgrounds, accessories) |
| `ratings` | User feedback on generated images |
| `visitors` | Website visitor tracking |
| `admin_settings` | System-wide configuration |

### 3.3 Verify Tables

Run this query to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- `admin_settings`
- `analytics_accessory_stats`
- `analytics_background_stats`
- `analytics_generations`
- `analytics_page_views`
- `analytics_style_stats`
- `analytics_subscriptions`
- `analytics_user_activity`
- `generated_images`
- `page_views`
- `payments`
- `ratings`
- `subscriptions`
- `user_events`
- `user_preferences`
- `user_trials`
- `users`
- `visitor_sessions`
- `visitors`

---

## 4. Authentication Providers

### 4.1 Enable Email Authentication

1. Go to **Authentication → Providers**
2. Enable **Email**
3. Configure:
   - ✅ Confirm email (recommended for production)
   - ✅ Secure email change
   - ✅ Secure password change

### 4.2 Google OAuth Setup

#### Step A: Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Configure:
   - **Application type**: Web application
   - **Name**: Click My Pet Production
   - **Authorized JavaScript origins**:
     ```
     https://www.clickmypet.com
     https://clickmypet.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://<YOUR-SUPABASE-PROJECT>.supabase.co/auth/v1/callback
     ```
6. Copy **Client ID** and **Client Secret**

#### Step B: Supabase Configuration

1. Go to **Authentication → Providers → Google**
2. Enable Google
3. Paste Client ID and Client Secret
4. Save

### 4.3 Facebook (Meta) OAuth Setup

#### Step A: Meta Developer Console

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create new app → Consumer type
3. Add **Facebook Login** product
4. Go to **Settings → Basic**:
   - **App Domains**: `clickmypet.com`
   - **Privacy Policy URL**: `https://www.clickmypet.com/privacy-policy`
   - **Terms of Service URL**: `https://www.clickmypet.com/terms-conditions`
5. Go to **Facebook Login → Settings**:
   - **Valid OAuth Redirect URIs**:
     ```
     https://<YOUR-SUPABASE-PROJECT>.supabase.co/auth/v1/callback
     ```
6. Copy **App ID** and **App Secret**

#### Step B: Supabase Configuration

1. Go to **Authentication → Providers → Facebook**
2. Enable Facebook
3. Paste App ID and App Secret
4. Save

### 4.4 Configure Redirect URLs

In **Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| Site URL | `https://www.clickmypet.com` |
| Redirect URLs | `https://www.clickmypet.com/onboarding` |
| | `https://www.clickmypet.com/dashboard` |
| | `https://www.clickmypet.com/payment-success` |

---

## 5. Environment Variables

### 5.1 Vercel Configuration

Go to Vercel Project → Settings → Environment Variables

Add the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Razorpay (Production Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_production_secret

# Black Forest Labs
BLACKFOREST_API_KEY=your_bfl_api_key

# App
NEXT_PUBLIC_APP_URL=https://www.clickmypet.com
NEXTAUTH_URL=https://www.clickmypet.com
NEXTAUTH_SECRET=generate_with_openssl_rand_hex_32

# Admin
ADMIN_API_KEY=your_secure_admin_key
```

### 5.2 Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -hex 32

# Generate ADMIN_API_KEY
openssl rand -hex 24
```

---

## 6. Row Level Security (RLS)

RLS is already enabled in `schema.sql`. Verify with:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

### Key Policies:

| Table | Policy | Description |
|-------|--------|-------------|
| `users` | Own profile only | Users can only read/update their own profile |
| `subscriptions` | Own subscriptions | Users see only their subscriptions |
| `payments` | System managed | Only server-side access |
| `generated_images` | Own images | Users see only their generations |
| `ratings` | Own ratings | Users can create/view their ratings |

---

## 7. Storage Buckets

### 7.1 Create Buckets

In **Storage**, create these buckets:

| Bucket | Purpose | Public? |
|--------|---------|---------|
| `pet-uploads` | User uploaded pet photos | No |
| `generated-images` | AI generated portraits | Yes (CDN) |
| `avatars` | User profile pictures | Yes |

### 7.2 Storage Policies

For `pet-uploads` (private):
```sql
-- Allow users to upload their own photos
CREATE POLICY "Users can upload pet photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pet-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own photos
CREATE POLICY "Users can view own pet photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'pet-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
```

For `generated-images` (public CDN):
```sql
-- Public read access for generated images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images');

-- Only system can write
CREATE POLICY "System can write"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images' AND auth.role() = 'service_role');
```

---

## 8. Production Checklist

### Database
- [ ] Schema executed successfully
- [ ] All 19+ tables created
- [ ] Indexes created for performance
- [ ] RLS enabled on all tables
- [ ] Policies verified

### Authentication
- [ ] Email provider enabled
- [ ] Google OAuth configured
- [ ] Facebook OAuth configured
- [ ] Redirect URLs set correctly
- [ ] Email templates customized

### Storage
- [ ] `pet-uploads` bucket created
- [ ] `generated-images` bucket created
- [ ] Storage policies applied

### Environment
- [ ] All Vercel env vars set
- [ ] Production Razorpay keys (not test)
- [ ] BFL API key configured
- [ ] Secrets properly secured

### Testing
- [ ] Email signup works
- [ ] Google login works
- [ ] Facebook login works
- [ ] Password reset works
- [ ] Session persistence works

---

## Troubleshooting

### "Invalid login credentials"
- Check email provider is enabled
- Verify email confirmation is working

### "OAuth callback failed"
- Verify redirect URI matches exactly (no trailing slash)
- Check OAuth credentials are correct
- Ensure provider is enabled in Supabase

### "Database error"
- Check RLS policies aren't blocking
- Verify service role key for server operations
- Check table exists and has correct schema

---

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Click My Pet Support: support@clickmypet.com
