# Workflow Audit & Inconsistencies Report
**Date:** December 22, 2025  
**Status:** Critical Issues Found

## 🚨 CRITICAL ISSUES

### 1. **Authentication Not Implemented (BLOCKING)**
**Location:** `src/app/onboarding/page.tsx` (lines 132-150)
- ❌ Google OAuth sign-up is a TODO stub
- ❌ Facebook OAuth sign-up is a TODO stub  
- ❌ Email authentication is a TODO stub
- **Current behavior:** All auth buttons just set `isAuthenticated=true` without real auth
- **Impact:** Users cannot actually create accounts in onboarding flow

**Required Fix:**
- Implement Supabase auth for Google/Facebook OAuth
- Implement magic link email authentication
- Connect to existing `/api/auth/magic-link` endpoint

---

### 2. **Missing Routes (404 Errors)**
**Broken Links Found:**

#### `/try-free` - Referenced but doesn't exist
- Referenced in: `src/app/result/page.tsx` (line 226)
- Referenced in: `src/app/api/auth/magic-link/route.ts` (email redirect)
- Referenced in: `src/app/sitemap.ts`
- Referenced in: `src/app/robots.ts`
- **Fix:** Create `src/app/try-free/page.tsx` OR redirect to `/onboarding`

#### `/reset-password` - Referenced but doesn't exist
- Referenced in: `src/app/login/page.tsx` (line 173)
- **Fix:** Create `src/app/reset-password/page.tsx` with password reset flow

---

## ⚠️ BRANDING INCONSISTENCIES

### 3. **Mixed Branding: PetPX vs Click My Pet**

**Areas still showing "PetPX" (need updating to "Click My Pet"):**

#### SEO & Metadata (High Priority)
- `src/app/layout.tsx` - All meta titles and OG tags say "PetPX"
- `src/app/page.tsx` - Home page title/description
- `src/lib/metadata.ts` - All page metadata configs
- `src/lib/structured-data.ts` - Organization schema, product names
- `src/app/sitemap.ts` - Base URL still `petpx.com`
- `src/app/robots.ts` - Base URL still `petpx.com`

#### User-Facing Pages
- `src/app/blog/page.tsx` - Blog title says "PetPX Blog"
- `src/app/terms-conditions/page.tsx` - Metadata and keywords
- `src/app/privacy-policy/page.tsx` - Metadata and keywords
- `src/app/referral/page.tsx` - Referral URLs use `petpx.com`

#### Admin & Analytics
- `src/app/admin/dashboard/page.tsx` - Export filename and analytics label
- `src/components/AdminHeader.tsx` - Admin panel title

#### Structured Data & Emails
- Email addresses still reference old domain:
  - `support@petpx.com` → should be `support@clickmypet.com`
  - Social media URLs: `twitter.com/petpx`, `instagram.com/petpx`, etc.

---

## 🔗 DOMAIN/URL INCONSISTENCIES

### 4. **Hardcoded Old Domain**
**Problem:** Multiple files hardcode `https://petpx.com`

**Should use environment variable:** `NEXT_PUBLIC_APP_URL` or consistent domain

**Files to update:**
- `src/lib/structured-data.ts` (line 5)
- `src/app/sitemap.ts` (line 4)
- `src/app/robots.ts` (line 4)
- `src/app/referral/page.tsx` (line 52, 325, 467)

**Recommended Fix:**
```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clickmypet.com'
```

---

## 🐛 USABILITY & UX ISSUES

### 5. **User Feedback: Using `alert()` Instead of Toast**
**Found in:**
- `src/app/result/page.tsx` (lines 128, 142)
- `src/app/admin/visitors/page.tsx` (line 121)

**Issue:** Browser `alert()` is jarring and not modern UX
**Fix:** Replace with toast notifications or inline error messages

---

### 6. **Error Handling Inconsistencies**
**Found:** Many `console.error()` calls without user-facing error messages
- Users see nothing when errors occur
- No retry mechanisms
- No graceful degradation

**Examples:**
- `src/app/dashboard/page.tsx` - Multiple silent errors in image generation
- `src/app/api/generate-images/route.ts` - Failed jobs don't notify user

---

## 📋 WORKFLOW-SPECIFIC ISSUES

### 7. **Onboarding → Checkout Flow**

**Current Flow:**
1. `/onboarding` (select styles/bg/accessories)
2. Choose plan → `/checkout?plan=X`
3. Payment → `/payment-success`
4. Dashboard → `/dashboard`

**Issues:**
- ✅ Flow structure is correct
- ❌ Auth doesn't work (see Issue #1)
- ❌ No validation if user tries to access checkout without onboarding data

**Recommendation:** Add route protection to ensure preferences exist before checkout

---

### 8. **Dashboard Generation Flow**

**Current Flow:**
1. Select pet type
2. Upload 5 photos
3. Generate images
4. Download results

**Issues:**
- ✅ Flow logic is implemented
- ❌ No proper loading states during upload (progress bar?)
- ❌ Generation polling could fail silently (max attempts: 30, then nothing)
- ⚠️ Download filenames now correct (`click-my-pet-...`)

---

### 9. **Payment Flow**

**Current Flow:**
1. Checkout page
2. Razorpay modal
3. `/api/payment/verify`
4. `/payment-success`

**Issues:**
- ✅ Razorpay integration looks complete
- ✅ Webhook handlers implemented
- ✅ Branding updated to "Click My Pet" in checkout modal
- ⚠️ Test mode in checkout allows bypass (intentional?)

---

## 📊 ADMIN PANEL ISSUES

### 10. **Admin Panel Inconsistencies**
- Admin dashboard still exports as `petpx-users-{date}.csv`
- Admin header shows "PetPX Admin"
- Analytics label shows "PetPX Analytics"

**Fix:** Update all admin branding to "Click My Pet"

---

## 🎨 ASSETS & MEDIA

### 11. **Logo Inconsistencies**
- ✅ User-facing pages now use `/heading.png` logo
- ❌ Structured data still references `/logo.png` (line 15)
- ❌ Onboarding previously used gradient "PX" icon (now fixed)

**Verify:** Does `/logo.png` exist? If not, update structured data.

---

### 12. **Video Replacements** ✅
- ✅ How It Works section now uses 3 videos:
  - `choose-your-favorite-styles.mp4`
  - `upload-your-pet-photos.mp4`
  - `download-pet-portraits.mp4`

---

## 🔐 SECURITY & ENVIRONMENT

### 13. **Environment Variable Usage**
**Check:** Ensure `.env.local` has all required vars:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
ADMIN_API_KEY=
BLACKFOREST_API_KEY=
```

---

## 📝 TODO MARKERS FOUND

**In Code:**
1. `src/app/onboarding/page.tsx`:
   - Line 132: TODO: Implement Google OAuth
   - Line 139: TODO: Implement Facebook OAuth
   - Line 147: TODO: Implement email auth

2. `src/lib/visitor-tracking.ts`:
   - Line 97: TODO: Integrate with cookie consent banner

---

## 🎯 PRIORITY ACTION ITEMS

### HIGH PRIORITY (Blocking User Flow)
1. ✅ ~~Implement authentication in onboarding~~ → **CRITICAL**
2. ✅ ~~Create `/try-free` page or redirect~~ → **404 ERROR**
3. ✅ ~~Create `/reset-password` page~~ → **404 ERROR**
4. Update all SEO metadata from PetPX → Click My Pet
5. Update domain URLs from petpx.com → clickmypet.com (or use env var)

### MEDIUM PRIORITY (UX/Branding)
6. Replace `alert()` with toast notifications
7. Update admin panel branding
8. Update email addresses in structured data
9. Add better error handling with user feedback
10. Update referral page URLs

### LOW PRIORITY (Polish)
11. Add loading states to upload flow
12. Add retry mechanisms for failed API calls
13. Verify `/logo.png` exists or update references
14. Update cookie consent integration

---

## ✅ RECENTLY COMPLETED
- Dashboard branding updated to Click My Pet
- Dashboard download filenames updated
- Temp dashboard created with demo mode
- How It Works videos replaced (all 3 steps)
- Onboarding header updated
- Checkout payment modal updated

---

## 🔍 TESTING CHECKLIST

### User Flows to Test:
- [ ] Home → Onboarding → Checkout → Payment → Dashboard
- [ ] Dashboard image generation end-to-end
- [ ] Download single image
- [ ] Download multiple images (ZIP)
- [ ] Admin login and dashboard access
- [ ] Referral link generation
- [ ] All navigation links (check for 404s)
- [ ] Mobile responsiveness
- [ ] Payment success flow
- [ ] Error scenarios (network failures, etc.)

---

## 📞 CONTACT & FOLLOW-UP

**Next Steps:**
1. Prioritize authentication implementation
2. Create missing pages (`/try-free`, `/reset-password`)
3. Do a global find/replace for remaining PetPX references
4. Update domain to clickmypet.com throughout
5. Test all critical user flows end-to-end

**Questions for Product Owner:**
- What should `/try-free` route do? (Redirect to onboarding? Separate free tier?)
- Confirm new domain: `clickmypet.com`?
- Should referral program use old or new domain?
- Admin panel - keep test mode bypass in checkout?
