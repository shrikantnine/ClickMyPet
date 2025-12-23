# 🚀 Click My Pet - Launch Checklist

## Pre-Launch Tasks & Test Cases

**Target Domain**: www.clickmypet.com  
**Status**: 🔴 Not Launched  
**Last Updated**: December 2025

---

## Table of Contents

1. [Critical Path Items](#1-critical-path-items)
2. [Supabase Configuration](#2-supabase-configuration)
3. [Authentication Testing](#3-authentication-testing)
4. [Payment Integration](#4-payment-integration)
5. [AI Generation Pipeline](#5-ai-generation-pipeline)
6. [User Dashboard Testing](#6-user-dashboard-testing)
7. [Performance & Security](#7-performance--security)
8. [Final Deployment](#8-final-deployment)

---

## 1. Critical Path Items

### 🔴 BLOCKERS (Must complete before launch)

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1.1 | Configure Supabase production project | - | ⬜ Not Started | See SUPABASE_SETUP.md |
| 1.2 | Set up Google OAuth in production | - | ⬜ Not Started | Need Google Cloud Console access |
| 1.3 | Set up Facebook OAuth in production | - | ⬜ Not Started | Need Meta Developer access |
| 1.4 | Configure Razorpay production keys | - | ⬜ Not Started | Switch from test to live keys |
| 1.5 | Add BFL API key to Vercel env | - | ⬜ Not Started | Get from Black Forest Labs |
| 1.6 | Configure clickmypet.com domain in Vercel | - | ⬜ Not Started | DNS configuration |
| 1.7 | Run database migrations | - | ⬜ Not Started | Execute schema.sql |

---

## 2. Supabase Configuration

### 2.1 Project Setup

| Task | Status | Command/Notes |
|------|--------|---------------|
| Create production Supabase project | ⬜ | supabase.com/dashboard |
| Copy Project URL | ⬜ | → `NEXT_PUBLIC_SUPABASE_URL` |
| Copy anon key | ⬜ | → `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Copy service role key | ⬜ | → `SUPABASE_SERVICE_ROLE_KEY` |
| Add all keys to Vercel | ⬜ | Vercel → Settings → Env Vars |

### 2.2 Database Schema

| Task | Status | Notes |
|------|--------|-------|
| Open SQL Editor in Supabase | ⬜ | |
| Copy contents of `database/schema.sql` | ⬜ | |
| Execute SQL | ⬜ | |
| Verify all tables created | ⬜ | Run verification query |
| Verify RLS policies active | ⬜ | Check policy list |
| Create storage buckets | ⬜ | pet-uploads, generated-images |

### 2.3 Test Cases - Database

| Test | Expected Result | Status |
|------|-----------------|--------|
| Insert user record | Success | ⬜ |
| Query own user profile | Returns data | ⬜ |
| Query other user profile | Blocked by RLS | ⬜ |
| Insert subscription (anon) | Blocked | ⬜ |
| Insert subscription (service role) | Success | ⬜ |

---

## 3. Authentication Testing

### 3.1 Email Authentication

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Sign up with email | Enter email + password | Account created | ⬜ |
| Email verification | Click link in email | Email verified | ⬜ |
| Login with email | Enter credentials | Logged in | ⬜ |
| Wrong password | Enter wrong password | Error shown | ⬜ |
| Password reset | Click "Forgot password" | Reset email sent | ⬜ |

### 3.2 Google OAuth

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Click "Continue with Google" | On sign up page | Redirect to Google | ⬜ |
| Select Google account | Choose account | Redirect back | ⬜ |
| First login creates user | Check database | User record exists | ⬜ |
| Subsequent login works | Login again | Same user used | ⬜ |
| Cancel at Google | Click cancel | Returns with error | ⬜ |

### 3.3 Facebook OAuth

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Click "Continue with Facebook" | On sign up page | Redirect to FB | ⬜ |
| Authorize app | Click Continue | Redirect back | ⬜ |
| Profile data captured | Check user record | Name/email present | ⬜ |
| Login without FB app | Clear app access | Re-auth works | ⬜ |

### 3.4 Session Management

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Session persists refresh | Refresh page | Still logged in | ⬜ |
| Session persists close | Close & reopen | Still logged in | ⬜ |
| Logout clears session | Click logout | Redirected to home | ⬜ |
| Protected routes redirect | Visit /dashboard logged out | Redirect to login | ⬜ |

---

## 4. Payment Integration

### 4.1 Razorpay Configuration

| Task | Status | Notes |
|------|--------|-------|
| Get production API keys | ⬜ | Razorpay Dashboard |
| Update `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⬜ | Live key starts with `rzp_live_` |
| Update `RAZORPAY_KEY_SECRET` | ⬜ | |
| Configure webhook URL | ⬜ | `https://www.clickmypet.com/api/payment/webhook` |
| Enable auto-capture | ⬜ | In Razorpay settings |

### 4.2 Test Cases - Payment

| Test | Plan | Amount | Expected | Status |
|------|------|--------|----------|--------|
| Starter purchase | Starter | $29 | Payment success | ⬜ |
| Pro purchase | Pro | $49 | Payment success | ⬜ |
| Ultra purchase | Ultra | $79 | Payment success | ⬜ |
| Payment failure | Any | - | Error handled | ⬜ |
| Webhook received | Any | - | DB updated | ⬜ |
| Subscription created | Any | - | Record in DB | ⬜ |
| Credits assigned | Starter | - | 20 images | ⬜ |
| Credits assigned | Pro | - | 40 images | ⬜ |
| Credits assigned | Ultra | - | Unlimited | ⬜ |

### 4.3 Pricing Verification

| Plan | Price | Images | Styles | Backgrounds | Accessories |
|------|-------|--------|--------|-------------|-------------|
| Starter | $29 | 20 | 4 | 2 | ❌ |
| Pro | $49 | 40 | 8 | All | 4 |
| Ultra | $79 | Unlimited | All | All + Custom | All + Custom |

---

## 5. AI Generation Pipeline

### 5.1 BFL API Configuration

| Task | Status | Notes |
|------|--------|-------|
| Obtain BFL API key | ⬜ | From Black Forest Labs |
| Add to Vercel env | ⬜ | `BLACKFOREST_API_KEY` |
| Test API connectivity | ⬜ | Run test generation |
| Verify rate limits | ⬜ | Check quota |

### 5.2 Test Cases - Generation

| Test | Input | Expected | Status |
|------|-------|----------|--------|
| Single image generation | 1 photo + style | Image returned | ⬜ |
| Batch generation (5 images) | 5 photos | 5 images returned | ⬜ |
| Custom style (Ultra) | Custom text | Reflected in output | ⬜ |
| Custom background (Ultra) | Custom text | Reflected in output | ⬜ |
| Reference images (Pro+) | Multiple photos | Consistent pet look | ⬜ |
| Generation timeout | - | Graceful error | ⬜ |
| API error handling | Invalid request | User-friendly error | ⬜ |

### 5.3 Prompt Quality Checks

| Scenario | Check | Status |
|----------|-------|--------|
| Realistic style | Photo-quality output | ⬜ |
| Animated style | Cartoon-like output | ⬜ |
| Custom accessories | Visible in image | ⬜ |
| Pet breed accuracy | Matches uploaded photos | ⬜ |
| Background consistency | Matches selection | ⬜ |

---

## 6. User Dashboard Testing

### 6.1 Dashboard Features

| Feature | Test | Expected | Status |
|---------|------|----------|--------|
| View subscription | Load dashboard | Shows current plan | ⬜ |
| View remaining credits | Load dashboard | Accurate count | ⬜ |
| Upload pet photos | Drag & drop | Upload success | ⬜ |
| View uploaded photos | After upload | Thumbnails shown | ⬜ |
| Start generation | Click generate | Job started | ⬜ |
| View progress | During generation | Progress shown | ⬜ |
| View results | After completion | Images displayed | ⬜ |
| Download images | Click download | File downloaded | ⬜ |
| Rate generation | After viewing | Rating saved | ⬜ |

### 6.2 Image Display Tests

| Test | Expected | Status |
|------|----------|--------|
| Images load correctly | No broken images | ⬜ |
| Images are responsive | Scale on mobile | ⬜ |
| Lightbox/zoom works | Click to enlarge | ⬜ |
| Download works | Click downloads file | ⬜ |
| Share works | Copy link / share | ⬜ |

### 6.3 Mobile Dashboard Tests

| Test | Device | Expected | Status |
|------|--------|----------|--------|
| Dashboard loads | iPhone | Responsive layout | ⬜ |
| Upload works | iPhone | Touch upload works | ⬜ |
| Images display | iPhone | Grid displays well | ⬜ |
| Download works | iPhone | Saves to photos | ⬜ |

---

## 7. Performance & Security

### 7.1 Performance Tests

| Test | Target | Status |
|------|--------|--------|
| Homepage load time | < 2 seconds | ⬜ |
| Onboarding load time | < 1.5 seconds | ⬜ |
| Dashboard load time | < 2 seconds | ⬜ |
| Image upload speed | < 3 seconds per image | ⬜ |
| Lighthouse score | > 90 | ⬜ |
| Mobile performance | > 85 | ⬜ |

### 7.2 Security Checks

| Check | Tool/Method | Status |
|-------|-------------|--------|
| HTTPS enabled | Browser check | ⬜ |
| API keys not exposed | Network tab check | ⬜ |
| RLS policies active | Supabase dashboard | ⬜ |
| CORS configured | API test | ⬜ |
| Rate limiting works | Rapid requests | ⬜ |
| XSS protection | Security scanner | ⬜ |
| SQL injection protection | Test inputs | ⬜ |

### 7.3 Error Handling

| Scenario | Expected | Status |
|----------|----------|--------|
| Network error | User-friendly message | ⬜ |
| API timeout | Retry option shown | ⬜ |
| Invalid file upload | Clear error message | ⬜ |
| Payment failure | Return to checkout | ⬜ |
| Session expired | Redirect to login | ⬜ |

---

## 8. Final Deployment

### 8.1 Domain Configuration

| Task | Status | Notes |
|------|--------|-------|
| Add domain to Vercel | ⬜ | clickmypet.com + www |
| Configure DNS records | ⬜ | A and CNAME records |
| SSL certificate active | ⬜ | Auto-provisioned |
| www redirect works | ⬜ | Redirect to apex or vice versa |
| Old domain redirects | ⬜ | If applicable |

### 8.2 Environment Variables (Production)

| Variable | Set | Verified |
|----------|-----|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⬜ | ⬜ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⬜ | ⬜ |
| `SUPABASE_SERVICE_ROLE_KEY` | ⬜ | ⬜ |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⬜ | ⬜ |
| `RAZORPAY_KEY_ID` | ⬜ | ⬜ |
| `RAZORPAY_KEY_SECRET` | ⬜ | ⬜ |
| `BLACKFOREST_API_KEY` | ⬜ | ⬜ |
| `NEXT_PUBLIC_APP_URL` | ⬜ | ⬜ |
| `NEXTAUTH_URL` | ⬜ | ⬜ |
| `NEXTAUTH_SECRET` | ⬜ | ⬜ |
| `ADMIN_API_KEY` | ⬜ | ⬜ |

### 8.3 Final Verification

| Check | Status |
|-------|--------|
| Homepage loads on production URL | ⬜ |
| All CTAs work | ⬜ |
| Sign up flow complete | ⬜ |
| Payment flow complete | ⬜ |
| Generation flow complete | ⬜ |
| Dashboard shows results | ⬜ |
| Download works | ⬜ |
| Mobile experience verified | ⬜ |
| Error pages work (404, 500) | ⬜ |

---

## Post-Launch Monitoring

### First 24 Hours

- [ ] Monitor error logs (Vercel)
- [ ] Check Supabase dashboard for errors
- [ ] Monitor payment webhooks
- [ ] Check BFL API usage/quota
- [ ] Review user feedback

### First Week

- [ ] Analyze conversion funnel
- [ ] Review generation success rate
- [ ] Check user ratings distribution
- [ ] Monitor performance metrics
- [ ] Address any reported bugs

---

## Rollback Plan

If critical issues arise:

1. **Revert to previous deployment**:
   ```bash
   vercel rollback
   ```

2. **Disable payments temporarily**:
   - Remove Razorpay keys from Vercel

3. **Enable maintenance mode**:
   - Add maintenance page redirect

4. **Contact support**:
   - Supabase: support@supabase.io
   - Vercel: support.vercel.com
   - BFL: Support portal

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Developer | | | |
| QA | | | |
| Product Owner | | | |

---

**🟢 LAUNCH APPROVED**: When all critical items (Section 1) are ✅

---

*This checklist should be reviewed and updated after each test cycle.*
