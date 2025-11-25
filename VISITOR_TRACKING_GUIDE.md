# Visitor Tracking System - Setup Guide

## Overview

The Click My Pet website now has a comprehensive visitor tracking system that captures:
- All website visitors (anonymous and identified)
- Device fingerprints for cross-device tracking
- Cookies, localStorage, and sessionStorage data
- UTM campaign parameters and traffic sources
- Page browsing behavior and engagement metrics
- Conversion tracking (free trial → paid subscription)

**🎛️ NEW: Admin Toggle Control**
- Enable/disable tracking globally via admin dashboard
- A/B test impact on conversions
- GDPR-compliant instant shutoff
- See [ADMIN_TRACKING_TOGGLE.md](./ADMIN_TRACKING_TOGGLE.md) for details

## Database Schema

### Tables Created

1. **admin_settings** - Global tracking control
   - Enable/disable visitor tracking system-wide
   - Audit trail of setting changes
   - Default: ENABLED

2. **visitors** - Main visitor tracking table
   - Unique visitor_id (yyyymmddhhmmss_random format)
   - Email (when provided)
   - Device & browser information
   - UTM parameters and traffic sources
   - Cookies and storage data
   - Behavioral metrics (page views, time on site, scroll depth)
   - Conversion data

3. **visitor_sessions** - Individual browsing sessions
   - Links to visitors table
   - Session duration and pages visited
   - Event tracking within session

4. **page_views** - Detailed page-level tracking
   - Individual page views with timestamps
   - Time spent on each page
   - Scroll depth and interactions

### Setup Database

Run the SQL in `/database/schema.sql` in your Supabase SQL editor:

```bash
# The schema includes:
# - CREATE TABLE visitors (...)
# - CREATE TABLE visitor_sessions (...)
# - CREATE TABLE page_views (...)
# - CREATE INDEX statements for fast queries
```

## Environment Variables

Add to your `.env.local`:

```env
# Admin access key for visitor analytics dashboard
ADMIN_SECRET_KEY=your_secure_admin_key_here

# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: Generate a strong random key for `ADMIN_SECRET_KEY`. This protects your visitor data.

## Features Implemented

### 1. Automatic Visitor Tracking

**Location**: `/src/lib/visitor-tracking.ts`

The SDK automatically captures:
- ✅ Visitor ID (yyyymmddhhmmss format)
- ✅ Device fingerprint (canvas + audio + WebGL)
- ✅ Browser & OS detection
- ✅ Screen resolution, viewport, color depth
- ✅ Timezone & language
- ✅ All cookies (excluding sensitive keys)
- ✅ localStorage & sessionStorage data
- ✅ Referrer and landing page
- ✅ UTM campaign parameters
- ✅ Page views and navigation
- ✅ Time on page
- ✅ Scroll depth
- ✅ CTA click tracking

**Integrated into**: `/src/app/layout.tsx` via `<VisitorTrackingProvider />`

**Admin Control**: Checks `/api/tracking-status` before initializing. Respects global enable/disable setting.

### 2. GDPR Cookie Consent Banner

**Location**: `/src/components/CookieConsent.tsx`

- Shows cookie consent banner on first visit (only if tracking enabled globally)
- Allows users to Accept or Decline tracking
- Respects user privacy choices
- Re-prompts every year (GDPR compliance)
- Provides link to privacy policy
- Automatically hides if admin disables tracking globally

**Functions**:
- `grantTrackingConsent()` - Enable tracking
- `revokeTrackingConsent()` - Disable tracking
- `deleteVisitorData()` - GDPR right to be forgotten

### 3. Admin Settings Dashboard ⭐ NEW

**Location**: `/src/app/admin/settings/page.tsx`

**Features**:
- 🎛️ **Master Toggle** - Enable/disable tracking system-wide with one click
- 📊 **Live Statistics** - Real-time visitor metrics when enabled
- 📋 **Data Overview** - See what data is being collected
- 🔒 **GDPR Status** - Compliance indicators and information
- 💡 **A/B Testing Guide** - Impact analysis recommendations

**Access**: Navigate to `/admin/settings` and enter your admin key

**Use Cases**:
- Test conversion rates with/without tracking
- Quickly disable for GDPR audits
- Reduce costs during slow periods
- Compare "lightweight" vs "data-rich" strategies

### 4. Email Linking

When a user provides their email (on `/try-free` page):

```typescript
import { setVisitorEmail } from '@/lib/visitor-tracking'

// Call when user submits email
setVisitorEmail('user@example.com')
```

This links the anonymous visitor record with the email for retargeting.

### 4. Custom Event Tracking

Track custom events anywhere in your app:

```typescript
import { trackCustomEvent } from '@/lib/visitor-tracking'

// Track any custom event
trackCustomEvent('button_clicked', { button: 'hero_cta' })
trackCustomEvent('video_played', { video_id: 'intro_video' })
trackCustomEvent('form_submitted', { form: 'contact_form' })
```

### 5. Admin Analytics Dashboard

**URL**: `https://clickmypet.com/admin/visitors`

**Authentication**: Requires `ADMIN_SECRET_KEY` from environment variables

**Features**:
- 📊 Real-time visitor stats
  - Total visitors
  - Last 24 hours unique visitors
  - Average time on site
  - Conversion rate
- 🔍 Search & filter visitors
  - By email, visitor ID, or IP
  - Filter by conversion status
  - Filter by device type
- 📋 Visitor table with:
  - Visitor ID
  - Email (if provided)
  - Device & browser info
  - Traffic source (UTM parameters)
  - Page views
  - Time on site
  - Conversion status
  - First visit date
- 📈 Traffic analytics
  - Top traffic sources
  - Device breakdown (mobile/desktop/tablet)
- 📥 CSV export functionality

### 6. API Endpoints

#### Track Visitor Data
**POST** `/api/track-visitor`
- Called automatically by SDK
- Stores visitor data in database
- Updates on every page view

#### Get Visitors (Admin)
**GET** `/api/admin/visitors`
- Requires Authorization header: `Bearer YOUR_ADMIN_KEY`
- Query params: `page`, `limit`, `search`, `converted`, `device`
- Returns paginated visitor list + stats

#### Export Visitors CSV (Admin)
**GET** `/api/admin/export-visitors`
- Requires Authorization header: `Bearer YOUR_ADMIN_KEY`
- Query params: `search`, `converted`, `device`
- Returns CSV file download

#### Delete Visitor Data (GDPR)
**DELETE** `/api/track-visitor`
- Body: `{ visitorId: "20251109143022_abc123" }`
- Deletes all visitor data for GDPR compliance

## Testing the System

### 1. Test Visitor Tracking

1. Open your website in incognito mode
2. Navigate to a few pages
3. Check browser console for tracking events
4. Open Supabase → visitors table → see new record

### 2. Test Email Linking

1. Visit `/try-free`
2. Submit email
3. Check visitors table → email column should be populated
4. Visitor record links anonymous browsing to email

### 3. Test Cookie Consent

1. Visit homepage
2. Cookie banner should appear at bottom
3. Click "Accept Cookies" → tracking starts
4. Click "Decline" → tracking disabled
5. Check localStorage: `visitor_tracking_consent` = "true" or "false"

### 4. Test Admin Dashboard

1. Visit `/admin/visitors`
2. Enter your `ADMIN_SECRET_KEY`
3. View visitor analytics
4. Test filters and search
5. Export CSV

## Marketing Use Cases

### 1. Retargeting Campaigns

**Scenario**: User visited but didn't sign up

```sql
-- Get visitors who didn't convert
SELECT email, visitor_id, utm_source, landing_page
FROM visitors
WHERE converted = false
AND email IS NOT NULL
ORDER BY last_visit DESC;
```

Use this list for:
- Facebook/Google retargeting ads
- Email campaigns to recover abandoned visitors
- Personalized offers based on landing page

### 2. Campaign Attribution

**Scenario**: Which marketing channel brings best users?

```sql
-- Conversion rate by traffic source
SELECT 
  utm_source,
  COUNT(*) as total_visitors,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END) as conversions,
  ROUND(SUM(CASE WHEN converted THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as conversion_rate
FROM visitors
GROUP BY utm_source
ORDER BY conversion_rate DESC;
```

### 3. Device Optimization

**Scenario**: Mobile users have low conversion rate

```sql
-- Conversion by device type
SELECT 
  device_type,
  AVG(time_on_site) as avg_time,
  AVG(page_views) as avg_pages,
  SUM(CASE WHEN converted THEN 1 ELSE 0 END)::numeric / COUNT(*) as conversion_rate
FROM visitors
GROUP BY device_type;
```

If mobile conversion is low → optimize mobile UX.

### 4. Behavioral Segmentation

**Scenario**: Users who viewed pricing but didn't convert

```sql
-- Visitors who viewed pricing page but didn't convert
SELECT v.*
FROM visitors v
WHERE v.converted = false
AND v.pages_visited::text LIKE '%pricing%'
AND v.email IS NOT NULL;
```

Send targeted email: "Still thinking? Here's 20% off!"

### 5. Geographic Targeting

**Scenario**: Launch in specific countries

```sql
-- Top countries by visitor count
SELECT country, COUNT(*) as visitors
FROM visitors
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visitors DESC
LIMIT 10;
```

## Privacy & Compliance

### GDPR Compliance Checklist

✅ **Cookie consent banner** - Implemented (`CookieConsent.tsx`)
✅ **Opt-out mechanism** - Users can decline tracking
✅ **Data deletion** - DELETE endpoint for right to be forgotten
✅ **Privacy policy** - Update `/privacy-policy` to mention tracking
✅ **Secure storage** - Data stored in encrypted Supabase database
✅ **Admin-only access** - Visitor data requires admin authentication

### What NOT to Track

❌ **Passwords** - Never track password fields
❌ **Credit card numbers** - Sensitive payment data
❌ **Social security numbers** - PII protection
❌ **Medical information** - HIPAA compliance

The SDK filters out keys containing: `password`, `token`, `secret`, `key`, `auth`

### Cookie Policy

Add to your privacy policy:

```
We use cookies and similar tracking technologies to:
- Analyze website traffic and usage patterns
- Remember your preferences
- Understand marketing campaign effectiveness
- Improve user experience

You can opt out of tracking by declining cookies in the banner.
```

## Troubleshooting

### Tracking Not Working

1. Check browser console for errors
2. Verify `visitor_tracking_consent` in localStorage is "true"
3. Check Network tab → `/api/track-visitor` should be called
4. Verify Supabase credentials in `.env.local`

### Admin Dashboard 401 Error

1. Check `ADMIN_SECRET_KEY` is set in `.env.local`
2. Verify you're using the correct key when logging in
3. Restart Next.js dev server after adding env variable

### Database Errors

1. Run the schema SQL in Supabase SQL editor
2. Check Supabase logs for permission errors
3. Verify service role key has proper permissions

## Next Steps

### Recommended Enhancements

1. **Email Automation**
   - Welcome series for new visitors
   - Abandoned cart emails for incomplete signups
   - Re-engagement campaigns for returning visitors

2. **Advanced Analytics**
   - Funnel analysis (homepage → try-free → conversion)
   - Cohort analysis (weekly user retention)
   - A/B testing framework for landing pages

3. **Integrations**
   - Google Analytics 4 events
   - Facebook Pixel for retargeting ads
   - Zapier webhooks for automated workflows

4. **Machine Learning**
   - Predict conversion probability based on behavior
   - Recommend personalized offers
   - Identify high-value visitor segments

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Review browser console for JavaScript errors
3. Test in incognito mode to isolate cookie issues
4. Verify all environment variables are set correctly

---

**System Status**: ✅ Fully Implemented & Ready for Production

Last Updated: November 2024
