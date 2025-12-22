# Quick Start Guide - Next Steps

## Immediate Actions Required

### 1. Setup OAuth Providers (30 minutes)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://clickmypet.com/auth/callback
   https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback
   ```
6. Copy Client ID & Secret

#### Facebook OAuth
1. Go to [Facebook for Developers](https://developers.facebook.com)
2. Create new app (Consumer type)
3. Add Facebook Login product
4. Configure redirect URIs (same as above)
5. Copy App ID & App Secret

#### Configure Supabase
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google → Paste Client ID & Secret → Save
3. Enable Facebook → Paste App ID & Secret → Save
4. Go to URL Configuration → Set Site URL: `https://clickmypet.com`

### 2. Execute Database Migrations (5 minutes)

1. Open Supabase Dashboard → SQL Editor
2. Copy this SQL:

```sql
-- Ratings Table
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  improvement_areas TEXT[] DEFAULT '{}',
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_generation_id ON public.ratings(generation_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rating ON public.ratings(rating);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON public.ratings(created_at DESC);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own ratings"
  ON public.ratings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all ratings"
  ON public.ratings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Generations Table (for API workflow)
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  style TEXT NOT NULL,
  background TEXT NOT NULL,
  accessory TEXT,
  image_urls TEXT[] NOT NULL,
  total_generated INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

3. Click "Run"
4. Verify tables created successfully

### 3. Update Environment Variables (5 minutes)

Create/update `.env.local`:

```bash
# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App URL - Update based on environment
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Production: NEXT_PUBLIC_APP_URL=https://clickmypet.com

# Razorpay (should already exist)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Black Forest Labs API (for generation - add when ready)
BLACKFOREST_API_KEY=your_api_key_here
```

### 4. Test Authentication (10 minutes)

```bash
# Start dev server
npm run dev
```

1. Go to http://localhost:3000/onboarding
2. Test Google sign in → Should redirect to Google → Return to onboarding
3. Test Facebook sign in → Should redirect to Facebook → Return to onboarding
4. Test email magic link → Should receive email → Click link → Return to onboarding
5. Verify you see "Successfully signed in!" toast
6. Check you're on Step 2 (Style Selection)

**If auth doesn't work:**
- Check browser console for errors
- Check Supabase logs (Dashboard → Logs → Auth)
- Verify redirect URIs match exactly
- Try incognito mode

### 5. Integrate Components (15 minutes)

#### Add Upload Progress to Dashboard

Edit `src/app/dashboard/page.tsx`:

```typescript
import PhotoUploadProgress from '@/components/PhotoUploadProgress'

// Replace your current file input section with:
<PhotoUploadProgress
  minFiles={10}
  maxFiles={20}
  onUploadComplete={(urls) => {
    setUploadedImages(urls)
    toast.success('Images uploaded successfully!')
  }}
/>
```

#### Add Rating Modal to Dashboard

Edit `src/app/dashboard/page.tsx`:

```typescript
import RatingModal from '@/components/RatingModal'
import { useState } from 'react'

// Add state
const [showRating, setShowRating] = useState(false)
const [generationId, setGenerationId] = useState('')

// After generation completes, trigger modal
useEffect(() => {
  if (generationComplete) {
    setGenerationId(`gen_${Date.now()}_${session.user.id}`)
    setShowRating(true)
  }
}, [generationComplete])

// Add modal to render
return (
  <div>
    {/* Your existing dashboard code */}
    
    <RatingModal
      isOpen={showRating}
      onClose={() => setShowRating(false)}
      userId={session?.user?.id || ''}
      generationId={generationId}
    />
  </div>
)
```

### 6. Replace alert() with toast() (10 minutes)

Find all `alert()` calls and replace:

```bash
# Search for alert usage
grep -r "alert(" src/

# Replace each one:
# Before:
alert('Payment successful!')

# After:
import { toast } from 'sonner'
toast.success('Payment successful!')

# Error alerts:
alert('Error: ' + error.message)
// Becomes:
toast.error(error.message)
```

---

## Testing Checklist

Run through this before deploying:

### ✅ Authentication
- [ ] Google login works
- [ ] Facebook login works  
- [ ] Email magic link works
- [ ] Session persists after refresh
- [ ] Can logout successfully
- [ ] Redirect after login goes to onboarding

### ✅ Uploads
- [ ] Can select files via click
- [ ] Can drag & drop files
- [ ] Progress bar shows and updates
- [ ] Multiple files upload simultaneously
- [ ] Error handling works (wrong file type, too large)
- [ ] Toast notifications appear
- [ ] Can retry failed uploads
- [ ] Can remove files from list

### ✅ Ratings
- [ ] Modal appears after generation
- [ ] Can select 1-5 stars
- [ ] Low rating (1-3) shows improvement options
- [ ] Can select multiple improvements
- [ ] Can add custom feedback
- [ ] 5-star rating shows Trustpilot link
- [ ] Trustpilot link opens in new tab
- [ ] Rating saves to database
- [ ] Can close modal

### ✅ Branding
- [ ] No "PetPX" text anywhere on site
- [ ] Logo shows "Click My Pet"
- [ ] Header shows clickmypet.com in links
- [ ] Footer shows correct branding
- [ ] Email templates updated (check Supabase)
- [ ] SEO meta tags show "Click My Pet"
- [ ] Structured data correct (Google Rich Results Test)

### ✅ General Flow
- [ ] Homepage loads correctly
- [ ] Can navigate to onboarding
- [ ] Can complete style selection
- [ ] Can complete background selection
- [ ] Can complete accessory selection
- [ ] Can upload photos
- [ ] Can proceed to checkout
- [ ] Payment flow works
- [ ] Redirects to dashboard after payment
- [ ] Can download generated images

---

## Common Issues & Solutions

### Issue: "Redirect URI mismatch" error
**Solution:** 
- Check URIs in Google/Facebook console match EXACTLY
- Include both localhost and production URLs
- Format: `http://localhost:3000/auth/callback` (no trailing slash)

### Issue: Toast notifications don't appear
**Solution:**
- Check `<Toaster />` is in layout.tsx before `</body>`
- Verify sonner is installed: `npm list sonner`
- Check browser console for errors

### Issue: Rating modal doesn't open
**Solution:**
- Check `showRating` state is being set to true
- Verify `RatingModal` component is imported correctly
- Check console for component errors

### Issue: Upload progress bar doesn't update
**Solution:**
- Verify `/api/upload-image` endpoint exists and works
- Check Network tab for XHR progress events
- Ensure CORS is configured correctly

### Issue: Auth state doesn't persist
**Solution:**
- Check Supabase session storage
- Verify cookies are enabled
- Test in incognito mode
- Check localStorage for Supabase data

---

## Production Deployment

When ready to deploy:

1. **Update Environment Variables:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://clickmypet.com
   ```

2. **Update OAuth Redirect URIs:**
   - Add `https://clickmypet.com/auth/callback` to Google
   - Add `https://clickmypet.com/auth/callback` to Facebook
   - Update Supabase Site URL to `https://clickmypet.com`

3. **Build and Test:**
   ```bash
   npm run build
   npm run start
   ```

4. **Deploy:**
   - Vercel: `vercel --prod`
   - Or your preferred hosting platform

5. **Update DNS:**
   - Point clickmypet.com to your hosting
   - Wait for propagation (can take up to 48 hours)

6. **Test Production:**
   - Test all auth flows on production domain
   - Test payment flow with real card
   - Test image generation
   - Verify all links work

7. **Monitor:**
   - Check Supabase logs for errors
   - Monitor Razorpay dashboard for payments
   - Check analytics for traffic

---

## Support & Documentation

**Full Guides:**
- `AUTHENTICATION_SETUP_GUIDE.md` - Complete OAuth setup
- `MISSING_ROUTES_DOCUMENTATION.md` - Error handling & routes
- `API_GENERATION_WORKFLOW.md` - Batch generation system
- `IMPLEMENTATION_SUMMARY_FINAL.md` - Complete summary

**Quick Reference:**
- Component usage examples in each file
- Code comments throughout
- TypeScript types for guidance

**Need Help?**
1. Check browser console for errors
2. Check Supabase logs
3. Review documentation files
4. Test in incognito mode to rule out cache issues

---

**Last Updated:** December 22, 2025  
**Status:** Ready for OAuth setup and testing  
**Next Steps:** Complete steps 1-6 above, then test thoroughly before deploying
