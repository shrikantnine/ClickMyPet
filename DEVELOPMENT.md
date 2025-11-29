# PetPX Development Documentation

## Project Overview
PetPX is an AI-powered pet portrait generator built with **Next.js 15**, **Supabase**, and **Razorpay**. It allows users to upload photos of their pets, select artistic styles, and generate professional-quality portraits.

The project has evolved from a subscription/free-trial model to a **One-Time Payment** model optimized for conversion.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI (Shadcn)
- **Database & Auth**: Supabase
- **Payments**: Razorpay
- **AI Generation**: BlackForest Labs (Flux) via API

## Key Features

### 1. User Flow
- **Landing Page**: High-conversion landing page with testimonials, gallery, and pricing.
- **Onboarding**: A multi-step wizard (`/onboarding`) where users:
  - Upload pet photos.
  - Select Pet Type (Dog/Cat/Other).
  - Choose Styles, Backgrounds, and Accessories.
  - **Upsell Logic**: Dynamic plan limits trigger an "Upsell Modal" if the user selects more options than the Starter plan allows.
- **Checkout**: (`/checkout`)
  - Displays a summary of the user's configuration.
  - Offers Starter ($29), Pro ($49), and Ultra ($79) plans.
  - Captures "Checkout Intent" (user preferences) before payment for analytics.
- **Payment Success**: (`/payment-success`)
  - Verifies Razorpay signature.
  - Activates the order in Supabase.
  - Redirects to the generation dashboard.

### 2. Admin Dashboard
Located at `/admin`, protected by an `ADMIN_API_KEY`.
- **Dashboard** (`/admin/dashboard`): High-level metrics (Revenue, Total Users, Popular Styles).
- **Visitors** (`/admin/visitors`): Real-time visitor tracking, source analysis (UTM), and conversion rates.
- **Orders** (`/admin/orders`): Searchable log of all transactions with status and user details.
- **Settings** (`/admin/settings`): Toggle global visitor tracking and GDPR compliance features.

### 3. Analytics & Tracking
- **Visitor Tracking**: Custom SDK (`src/lib/visitor-tracking.ts`) tracks page views, time on site, and device fingerprinting.
- **Checkout Analytics**: Captures user preferences (Style, Breed, etc.) even if the payment fails, allowing for demand analysis.

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin portal routes
│   ├── api/                # Backend API routes
│   │   ├── admin/          # Admin-only endpoints
│   │   ├── payment/        # Razorpay integration
│   │   └── ...
│   ├── checkout/           # Payment page
│   ├── onboarding/         # User configuration wizard
│   ├── dashboard/          # User area (post-purchase)
│   └── ...
├── components/
│   ├── ui/                 # Reusable UI components (Buttons, Dialogs)
│   ├── AdminHeader.tsx     # Unified admin navigation
│   ├── HeroSection.tsx     # Landing page hero
│   └── ...
└── lib/
    ├── analytics.ts        # Supabase analytics helpers
    ├── pricing.ts          # Plan definitions and limits
    ├── razorpay.ts         # Payment gateway config
    └── visitor-tracking.ts # Frontend tracking SDK
```

## Recent Changes (Nov 2025)

1.  **Pivot to Paid-Only**:
    - Removed all "Free Trial" logic and pages (`src/app/try-free`).
    - Updated all CTAs to "Create Your Portrait" or "Get Started".
    - Removed `check-free-trial` API.

2.  **Admin Enhancements**:
    - **Unified Navigation**: Added `AdminHeader` for easy switching between Dashboard, Visitors, and Orders.
    - **Orders Page**: Added a dedicated view for transaction logs.
    - **Preference Tracking**: Checkout now sends user selections (styles/breeds) to the backend *before* payment to track demand.

3.  **Code Cleanup**:
    - Removed obsolete `officeoftheadmin` folder (replaced by `src/app/admin`).
    - Removed unused legacy APIs (`generate-simple`).

## Environment Variables
Required `.env` variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_API_KEY` (for accessing the admin dashboard)
