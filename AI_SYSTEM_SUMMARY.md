# AI Generation & Admin Dashboard - Quick Reference

## 🎨 What Was Built

### 1. **AI Prompt Generation System** (`/src/lib/ai-prompt-builder.ts`)
- Converts user selections into optimized prompts for Black Forest Labs Flux API
- 8 artistic styles (Professional Portrait, Watercolor, Disney Pixar, etc.)
- 8 backgrounds (Studio White, Garden, Beach, Urban, etc.)
- 8 accessories (Bow Tie, Crown, Sunglasses, etc.)
- Custom breed recognition for 15+ popular pet breeds
- Automatic prompt variations for batch generation

### 2. **Black Forest Labs API Integration** (`/src/lib/blackforest-api.ts`)
- Full integration with Flux Pro 1.1 API
- Rate limiting (10 requests/min, 5 concurrent jobs)
- Automatic job polling and status checking
- Plan-based quality settings (Starter: 1024px, Pro: 1536px, Max: 2048px)
- Error handling and retry logic

### 3. **Image Generation API** (`/src/app/api/generate-images/route.ts`)
- POST endpoint for starting generation
- GET endpoint for checking status
- Authentication with Supabase
- Subscription validation
- Image count tracking
- Automatic analytics recording

### 4. **Analytics System** (`/src/lib/analytics.ts`)
- Track every generation request with full details
- Real-time aggregation of popular styles/backgrounds/accessories
- User activity tracking
- Revenue and subscription trends
- Platform-wide statistics

### 5. **Admin Dashboard** (`/src/app/admin/dashboard`)
- **Hidden URL:** `/admin/dashboard` (not linked in UI)
- **Secure Access:** Requires ADMIN_API_KEY
- **Real-time Metrics:**
  - Total users & recent signups
  - Active subscriptions
  - Total generations & recent activity
  - Total revenue
- **Visual Analytics:**
  - Generation trends chart
  - Revenue trends chart
  - Plan distribution
  - Popular styles, backgrounds, accessories
- **Time Filters:** 7, 30, or 90 days

### 6. **Updated Database Schema** (`/database/schema.sql`)
- 7 new analytics tables
- 3 new helper functions for tracking
- Proper indexes for fast queries
- Row Level Security on all tables

## 🔑 Environment Variables Required

Add to `.env.local`:

```bash
# Black Forest Labs API
BLACKFOREST_API_KEY=your_key_here

# Admin Dashboard
ADMIN_API_KEY=generate_secure_key

# Supabase Service Role
SUPABASE_SERVICE_ROLE_KEY=from_supabase_dashboard
```

## 🚀 Quick Start

### 1. Get Black Forest Labs API Key
- Sign up: https://api.bfl.ml/
- Get API key from dashboard
- Cost: ~$0.04 per image

### 2. Generate Admin Key
```bash
openssl rand -hex 32
```

### 3. Get Supabase Service Role Key
- Supabase Dashboard → Settings → API
- Copy "service_role" key (NOT anon key)

### 4. Execute Database Schema
- Copy entire `database/schema.sql`
- Paste in Supabase SQL Editor
- Run to create all analytics tables

### 5. Access Admin Dashboard
- Navigate to: `https://your-domain.com/admin/dashboard`
- Enter your ADMIN_API_KEY
- View all analytics!

## 📊 How It Works

### User Flow:
1. User completes onboarding (style, background, accessories)
2. User purchases subscription
3. User requests image generation
4. System builds optimized prompt based on selections
5. Black Forest Labs API generates images
6. Images saved to database
7. User's image count decremented
8. Analytics automatically tracked

### Admin Flow:
1. Admin accesses hidden dashboard URL
2. Enters secure API key
3. Views real-time analytics:
   - What styles are popular?
   - What backgrounds do users prefer?
   - How many generations per day?
   - Revenue trends
   - Plan distribution
4. Makes product decisions based on data

## 🎯 Key Features

### For Users:
- High-quality AI image generation
- Multiple artistic styles
- Custom backgrounds and accessories
- Breed-specific optimizations
- Progress tracking

### For Product Team:
- Track user preferences in real-time
- Identify popular features
- Monitor generation trends
- Revenue analytics
- Plan performance metrics
- Make data-driven decisions

## 📁 New Files Created

```
src/
├── lib/
│   ├── ai-prompt-builder.ts      # Prompt generation logic
│   ├── blackforest-api.ts        # API integration
│   └── analytics.ts               # Analytics tracking
├── app/
│   ├── api/
│   │   ├── generate-images/
│   │   │   └── route.ts          # Generation endpoints
│   │   └── admin/
│   │       └── analytics/
│   │           └── route.ts      # Admin API
│   └── admin/
│       └── dashboard/
│           └── page.tsx           # Admin UI

database/
└── schema.sql                     # Updated with analytics tables

AI_GENERATION_SETUP.md             # Complete setup guide
```

## 🔒 Security Notes

- Admin dashboard is hidden (no UI links)
- Requires API key authentication
- Analytics use service role key (server-only)
- All tables have Row Level Security
- Rate limiting prevents abuse
- Environment variables never exposed to client

## 📈 Analytics Tracked

**Automatically:**
- Every image generation request
- Style/background/accessory selections
- User activity and page views
- Subscription events
- Revenue metrics

**Aggregated:**
- Popular styles (updated in real-time)
- Popular backgrounds (updated in real-time)
- Popular accessories (updated in real-time)
- Trends over time

## 💡 Next Steps

1. ✅ Set up environment variables
2. ✅ Execute database schema
3. ✅ Test generation flow
4. ✅ Access admin dashboard
5. 🔄 Integrate with onboarding flow (connect UI)
6. 🔄 Set up image storage (Supabase Storage)
7. 🔄 Add webhook for async processing
8. 🔄 Implement usage alerts

## 🐛 Troubleshooting

**"API key not configured"**
→ Add BLACKFOREST_API_KEY to .env.local

**"Unauthorized" on admin dashboard**
→ Check ADMIN_API_KEY matches in .env.local

**"No active subscription"**
→ User needs to purchase a plan first

**Analytics not showing**
→ Execute updated database schema

## 📞 API Endpoints

```bash
# Generate Images
POST /api/generate-images
Auth: User token
Body: { selections, numImages }

# Check Status  
GET /api/generate-images?id={uuid}
Auth: User token

# Admin Analytics
GET /api/admin/analytics?days=30
Auth: Bearer {ADMIN_API_KEY}
```

---

**Ready to use!** Follow AI_GENERATION_SETUP.md for detailed instructions.
