# PET PX - Setup Guide

## 🚀 Quick Start

Your dashboard is now fully functional! Follow these steps to get everything running.

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Black Forest Labs API Key** (optional for testing) - Get from [bfl.ml](https://bfl.ml)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Black Forest Labs API (optional - runs in simulation mode without it)
BLACKFOREST_API_KEY=your_api_key_here

# Razorpay (already configured)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_existing_key
RAZORPAY_KEY_SECRET=your_existing_secret
```

## 🗄️ Database Setup

### 1. Create Tables

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  images_remaining INTEGER NOT NULL,
  images_total INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Images Table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  image_url TEXT NOT NULL,
  style TEXT,
  background TEXT,
  accessories TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  favorite BOOLEAN DEFAULT FALSE
);

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own images" ON generated_images
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images" ON generated_images
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images" ON generated_images
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);
\`\`\`

### 2. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `pet-photos`
4. Make it **Public** (check "Public bucket")
5. Click "Create"

### 3. Set Storage Policies

In the `pet-photos` bucket policies:

\`\`\`sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-photos');

-- Allow public to view
CREATE POLICY "Public can view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-photos');
\`\`\`

## 🧪 Testing the Flow

### Test Mode (No API Key Required)

1. **Go to Checkout**
   ```
   http://localhost:3000/checkout
   ```

2. **Click Test Button**
   - Yellow button: "🧪 Test Mode - Skip Payment"
   - This creates a test subscription and redirects to dashboard

3. **Upload a Pet Photo**
   - Click "Choose Photo" or drag & drop
   - Any pet image will work

4. **Select Options**
   - Choose a style (e.g., "Professional Portrait")
   - Choose a background (e.g., "Studio White")
   - Choose an accessory (optional, e.g., "Bow Tie")

5. **Generate**
   - Click "Generate AI Portraits"
   - Wait 5 seconds (simulation mode)
   - Alert appears: "✨ Your images are ready!"
   - Automatically switches to Gallery tab
   - Shows your "generated" image

### With Real API (Black Forest Labs)

1. **Get API Key**
   - Sign up at [bfl.ml](https://bfl.ml)
   - Add to `.env.local`: `BLACKFOREST_API_KEY=your_key`

2. **Restart Dev Server**
   ```bash
   npm run dev
   ```

3. **Follow same steps as Test Mode**
   - Generation will take 2-3 minutes (real AI processing)
   - Polling checks every 10 seconds
   - Real AI-generated portraits appear in Gallery

## 📂 File Structure

```
src/
├── app/
│   ├── dashboard/page.tsx          # Main dashboard (Generate/Gallery/Subscription)
│   ├── api/
│   │   ├── upload-image/route.ts   # Handles file uploads to Supabase
│   │   └── generate-simple/route.ts # Handles image generation
├── components/
│   ├── Header.tsx                   # Navigation with Dashboard link
│   └── StickyCTA.tsx               # Sticky CTA component
└── lib/
    ├── supabase.ts                  # Supabase client & types
    └── utils.ts                     # Utility functions
```

## 🎨 Features Implemented

### ✅ Dashboard
- 3 tabs: Generate, Gallery, Subscription
- Welcome banner with credits display
- Quick stats cards (Plan, Images Generated, Usage %)
- File upload with drag-drop
- 3-step selection: Style → Background → Accessory
- Real-time credits validation
- Error handling with user feedback

### ✅ Backend Integration
- Supabase auth with test mode fallback
- Automatic file upload to Supabase Storage
- Credits checking before generation
- Job polling for completion tracking
- Database queries for subscriptions & images

### ✅ API Endpoints
- `/api/upload-image` - Uploads to Supabase Storage
- `/api/generate-simple` - Starts generation job
- GET `/api/generate-simple?jobId=xxx` - Checks job status

### ✅ Simulation Mode
- Works without API key for testing
- Completes in 5 seconds
- Returns uploaded image as "generated" result
- Perfect for development and UX testing

## 🚧 Still TODO

### High Priority
1. **Real Authentication**
   - Replace test mode with actual sign up/login
   - Email verification
   - Password reset

2. **Gallery Actions**
   - Download button (fetch from Supabase, trigger download)
   - Share button (copy link, social media)
   - Favorite toggle (update database)
   - Delete images

3. **Subscription Management**
   - Upgrade/downgrade plans
   - Add credits (micro-transactions)
   - Cancel subscription
   - Real billing info from Razorpay

### Medium Priority
4. **Email Notifications**
   - Generation complete
   - Low credits warning
   - Welcome email

5. **Error Recovery**
   - Retry failed generations
   - Refund credits on failure
   - Manual intervention for stuck jobs

### Low Priority
6. **Performance**
   - Image lazy loading
   - Thumbnail generation
   - Gallery pagination
   - Caching

7. **Analytics**
   - Track generation success rate
   - Popular styles/backgrounds
   - User retention
   - Revenue tracking

## 🐛 Troubleshooting

### "Unauthorized" Error
- Check Supabase credentials in `.env.local`
- Verify RLS policies are set correctly
- Use test mode button on checkout page

### Upload Fails
- Verify `pet-photos` bucket exists
- Check bucket is public
- Verify storage policies allow uploads

### Generation Doesn't Complete
- In simulation mode: should complete in 5 seconds
- With real API: can take 2-3 minutes
- Check console for errors
- Verify `BLACKFOREST_API_KEY` if using real API

### No Credits Showing
- Test mode automatically gives 35/40 credits
- For real users, subscription must be created during payment
- Check `subscriptions` table has active record

## 📱 User Journey

1. **Home Page** → Learn about PET PX
2. **Pricing** → Choose plan (Starter/Pro/Premium)
3. **Checkout** → Pay with Razorpay (or use Test button)
4. **Payment Success** → Auto-redirect to Dashboard
5. **Dashboard - Generate Tab** → Upload pet photo, select style/background/accessory
6. **Generate** → Wait for AI processing (5 sec simulation, 2-3 min real)
7. **Gallery Tab** → View, download, share, favorite images
8. **Subscription Tab** → Manage plan, view usage, add credits

## 🎯 Next Steps

1. **Test the flow** - Use test button to verify everything works
2. **Add your API key** - Get Black Forest Labs key for real generation
3. **Implement auth** - Replace test mode with real signup/login
4. **Add gallery actions** - Download, share, favorite functionality
5. **Deploy** - Use Vercel/Netlify for production deployment

## 🤝 Need Help?

Current implementation is fully functional for:
- ✅ Test mode flow (no API key needed)
- ✅ File uploads to Supabase
- ✅ Credits management
- ✅ Job polling
- ✅ Gallery display

Everything is ready for production with a few additions (auth, gallery actions, etc.).

---

**Built with:**
- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase (Auth, Storage, Database)
- Black Forest Labs Flux API
- Razorpay Payments
