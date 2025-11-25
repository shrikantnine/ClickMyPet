# 🚨 Fix: "Internal Server Error" - Missing Environment Variables

## Problem
You're getting an "Internal server error" because the environment variables are not configured.

## Quick Fix (5 minutes)

### Step 1: Get Supabase Credentials

1. Go to https://supabase.com
2. Log in or create a free account
3. Create a new project (or use existing)
4. Go to **Settings** → **API**
5. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 2: Update .env.local File

Open the file `.env.local` in your project root and replace the placeholder values:

**BEFORE (current - won't work):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**AFTER (with real values):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

### Step 3: Get Razorpay Credentials (Optional - for testing)

For now, you can use test credentials:

1. Go to https://razorpay.com
2. Sign up for free
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Key**
5. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

Update in `.env.local`:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Step 4: Restart Development Server

Stop the current server (Ctrl+C) and restart:

```bash
npm run dev
```

---

## Complete .env.local Template

Here's what your `.env.local` should look like with real values:

```env
# Supabase Configuration (REQUIRED - Get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQi...

# Razorpay Configuration (REQUIRED - Get from https://razorpay.com)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Optional (can keep as placeholders for now)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_can_be_anything_random
GOOGLE_CLIENT_ID=optional_for_now
GOOGLE_CLIENT_SECRET=optional_for_now
AI_MODEL_SERVER_URL=optional_for_now
AI_MODEL_API_KEY=optional_for_now
```

---

## Priority Setup Order

**To make payments work, you MUST configure:**

1. ✅ **NEXT_PUBLIC_SUPABASE_URL** (Required)
2. ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY** (Required)
3. ✅ **NEXT_PUBLIC_RAZORPAY_KEY_ID** (Required for payments)
4. ✅ **RAZORPAY_KEY_SECRET** (Required for payments)

**Optional (can add later):**
- SUPABASE_SERVICE_ROLE_KEY (for webhooks)
- NEXTAUTH_SECRET (for auth)
- Google OAuth credentials
- AI Model credentials

---

## How to Get Supabase Credentials (Step-by-Step)

### 1. Create Supabase Account
- Go to https://supabase.com
- Click "Start your project"
- Sign up with GitHub or email

### 2. Create New Project
- Click "New Project"
- Choose organization (or create one)
- Enter:
  - **Name:** petpx
  - **Database Password:** (choose a strong password)
  - **Region:** Choose closest to you
- Click "Create new project"
- Wait 1-2 minutes for setup

### 3. Get API Credentials
- In your project, click **Settings** (gear icon in sidebar)
- Click **API**
- You'll see:
  - **Project URL:** Copy this → goes to `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public:** Copy this → goes to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role:** Copy this → goes to `SUPABASE_SERVICE_ROLE_KEY`

### 4. Set Up Database
- Go to **SQL Editor** in Supabase
- Create a new query
- Copy contents from `database/schema.sql` in your project
- Paste and click "Run"
- This creates all necessary tables

---

## How to Get Razorpay Test Credentials

### 1. Create Razorpay Account
- Go to https://razorpay.com
- Click "Sign Up"
- Choose "Get Started for Free"
- Complete registration

### 2. Get Test API Keys
- In dashboard, go to **Settings** → **API Keys**
- Under "Test Mode", click **Generate Test Key**
- You'll see:
  - **Key Id:** Starts with `rzp_test_` → goes to `NEXT_PUBLIC_RAZORPAY_KEY_ID`
  - **Key Secret:** Hidden, click to reveal → goes to `RAZORPAY_KEY_SECRET`

### 3. Important
- These are **TEST keys** - no real money will be charged
- Use test cards for testing (provided in documentation)
- Switch to LIVE keys when ready for production

---

## Verify Setup

After updating `.env.local`:

1. **Restart server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Check terminal output:**
   - Should NOT see Supabase errors
   - Server should start without errors

3. **Test checkout:**
   - Click "Create Pet Portraits Now"
   - Complete onboarding
   - Go to checkout
   - Click "Proceed to Secure Payment"
   - Should see Razorpay payment modal

---

## Still Getting Errors?

### Error: "Invalid supabaseUrl"
**Fix:** Make sure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`

### Error: "Invalid API key"
**Fix:** Make sure you copied the FULL key (they're very long)

### Error: "Razorpay is not defined"
**Fix:** Check that `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly

### Can't find .env.local?
**Location:** `/Users/shrikantshinde/Downloads/PET PX/petpx/.env.local`

---

## Security Reminder

⚠️ **NEVER commit `.env.local` to Git!**

Your `.gitignore` should include:
```
.env.local
.env*.local
```

---

## Need Help?

1. Check Supabase documentation: https://supabase.com/docs
2. Check Razorpay documentation: https://razorpay.com/docs
3. See `QUICKSTART.md` for detailed setup guide

---

**Once you update the environment variables and restart the server, the error will be fixed!** ✅
