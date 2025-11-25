# PetPX - AI Pet Photo Generator

A modern, mobile-first SaaS website built with Next.js, Supabase, and Vercel for generating professional AI pet headshots.

## 🚀 Features

### Landing Page
- **Mobile-first responsive design** with auto-hiding header on scroll
- **Hero section** with animated marquee photo galleries and glass morphism text box
- **Trusted brands section** with dual marquee animations
- **4-step process** explanation with responsive image grid
- **Gallery showcase** with multiple marquee rows at different speeds
- **Pricing plans** (Starter $19, Pro $37, Max $59) with feature comparison
- **FAQ section** with smooth accordion animations
- **Closing section** with auto-scrolling image carousel
- **Sticky CTA button** that appears after hero section

### User Journey & Payment Flow ✨ NEW
- **Onboarding wizard** (/onboarding) - 3-step preference selection
  - Step 1: Choose from 8 AI styles with image previews
  - Step 2: Select from 8 background options
  - Step 3: Add optional accessories
  - Sticky bottom navigation with progress indicators
- **Checkout page** (/checkout) - Secure payment processing
  - Three pricing tiers with detailed features
  - Razorpay payment integration
  - Order summary and secure payment button
- **Payment success** (/payment-success) - Post-payment confirmation
  - Success animation and subscription details
  - Auto-redirect to dashboard
- **Secure payment processing** with Razorpay
- **7-day money-back guarantee**

### Navigation & Pages
- **Smart header** that hides on scroll down, shows on scroll up (mobile)
- **Burger menu** with login, how it works, pricing, and blog links
- **Blog system** with featured posts and individual blog pages
- **Legal pages** (Privacy Policy, Terms & Conditions)
- **Login/signup flow** with Google OAuth and email options

### Security & Database
- **Row Level Security (RLS)** on all database tables
- **Server-side pricing validation** - prices cannot be altered by client
- **Payment signature verification** using HMAC SHA256
- **Secure API routes** with authentication checks
- **Webhook handling** for payment events
- **Encrypted payment data** storage

### Technical Features
- **Uniform spacing system** with consistent gaps (10px base unit)
- **Glass morphism effects** and gradient buttons
- **Smooth animations** with Framer Motion
- **SEO optimized** with proper meta tags and structured data
- **Performance optimized** with Next.js App Router
- **Mobile and desktop responsive** throughout entire user journey

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Authentication**: NextAuth.js + Supabase Auth
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Payments**: Razorpay (fully integrated)
- **Animations**: Framer Motion + React Fast Marquee
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)
- **Security**: Server-side validation, encrypted payments, RLS policies

## 📁 Project Structure

```
petpx/
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── [slug]/page.tsx
│   │   │   └── page.tsx
│   │   ├── login/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   ├── terms-conditions/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.tsx
│   │   ├── ClosingSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── StickyCTA.tsx
│   │   └── TrustedBySection.tsx
│   └── lib/
│       ├── supabase.ts
│       └── utils.ts
├── .env.local
└── package.json
```

## 🎨 Design System

### Spacing Constants
- `SECTION_GAP: 10` - Base unit for consistent spacing
- `SMALL_GAP: 2` - Small element spacing
- `MEDIUM_GAP: 4` - Medium element spacing
- `LARGE_GAP: 8` - Large element spacing
- `IMAGE_GAP: 1` - Minimal gap between images

### Color Palette
- **Primary**: Blue gradients (from-blue-400 to-blue-600)
- **Secondary**: Purple accents (purple-600)
- **Neutral**: Gray scale (50, 100, 200, 600, 900)
- **Glass**: White with opacity (white/20, white/30)

### Typography
- **Headings**: Bold, large sizes with proper hierarchy
- **Body**: Leading-relaxed for readability
- **CTA**: Gradient buttons with hover effects

## 🚀 Getting Started

### Quick Start

1. **Clone and Install**
   ```bash
   cd petpx
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your credentials in .env.local:
   # - Supabase URL and keys
   # - Razorpay API keys
   ```

3. **Database Setup**
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL script from `database/schema.sql`
   - This creates all required tables, RLS policies, and functions

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Visit** http://localhost:3000

### Detailed Setup Guide

For complete payment integration setup, see **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)**

This includes:
- Getting Razorpay credentials
- Configuring Supabase
- Setting up webhooks
- Testing payment flow
- Going live checklist

## 🔧 Configuration

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay (for payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
AI_MODEL_SERVER_URL=your_ai_model_server_url
AI_MODEL_API_KEY=your_ai_model_api_key
```

### Supabase Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  subscription_plan TEXT CHECK (subscription_plan IN ('starter', 'pro', 'max')),
  credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated images table
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  background TEXT NOT NULL,
  accessories TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📱 Responsive Behavior

### Mobile (< 768px)
- Header auto-hides on scroll down, appears on scroll up
- Hero shows 3 photos per row in marquee
- Pricing cards stack vertically
- Navigation becomes burger menu
- Sticky CTA always visible at bottom

### Tablet (768px - 1024px)
- 2 columns for how-it-works section
- Header remains visible
- Adjusted marquee speeds

### Desktop (> 1024px)
- Full 4-column layout for how-it-works
- Header always visible
- Optimized marquee arrangements
- Larger text and spacing

## 🎯 Next Steps (Implementation Needed)

1. **Authentication Integration**
   - Complete Google OAuth setup
   - Implement Supabase auth hooks
   - Add protected routes

2. **Payment Processing**
   - Razorpay checkout flow
   - Subscription management
   - Credits system

3. **AI Integration**
   - Connect to AI model server
   - File upload handling
   - Image generation pipeline

4. **User Dashboard**
   - Upload interface
   - Style/background selection
   - Generated images gallery
   - Account settings

5. **Email System**
   - Welcome emails
   - Generation complete notifications
   - Marketing campaigns

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables on Vercel
Add all environment variables in Vercel dashboard under Project Settings > Environment Variables.

## 📝 Notes

- All components use mobile-first responsive design
- Consistent spacing system throughout
- Glass morphism effects for modern UI
- SEO optimized with proper meta tags
- Accessibility features included
- Performance optimized with Next.js features

## 🤝 Contributing

1. Follow the established design system
2. Maintain mobile-first approach
3. Use consistent spacing constants
4. Add proper TypeScript types
5. Test responsive behavior

## 📄 License

Private project - All rights reserved.

---

Built with ❤️ for pet parents everywhere! 🐾