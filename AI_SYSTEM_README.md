# PetPX AI Generation & Analytics System

## 🎯 Overview

Complete backend system for AI-powered pet image generation using Black Forest Labs Flux API, with a comprehensive admin dashboard for tracking user behavior, trends, and product metrics.

## 📦 What's Included

### Core Features

#### 1. **AI Prompt Generation Engine**
- Smart prompt builder that converts user selections into optimized AI prompts
- Support for 8 artistic styles, 8 backgrounds, 8 accessories
- Breed-specific optimizations for 15+ popular breeds
- Negative prompt generation for quality control
- Prompt variation system for diverse results

#### 2. **Black Forest Labs Integration**
- Full API integration with Flux Pro 1.1
- Automatic job management and polling
- Rate limiting and error handling
- Plan-based quality settings
- Cost-efficient batch processing

#### 3. **Analytics System**
- Real-time tracking of all user interactions
- Automatic aggregation of popular selections
- Revenue and subscription metrics
- User behavior patterns
- Generation trends over time

#### 4. **Admin Dashboard**
- Hidden secure dashboard at `/admin/dashboard`
- Real-time metrics visualization
- Style/background/accessory popularity
- Revenue and generation trends
- Plan distribution analysis
- Time-range filtering (7/30/90 days)

## 🏗️ Architecture

```
User Selects Preferences
    ↓
Purchases Subscription
    ↓
Requests Image Generation → AI Prompt Builder
    ↓                            ↓
Analytics Tracking      Optimized Prompt
    ↓                            ↓
Database Update         Black Forest Labs API
    ↓                            ↓
Admin Dashboard         Generated Images
                                ↓
                        Delivered to User
```

## 🚀 Setup Guide

### Step 1: Environment Variables

Create/update `.env.local`:

```bash
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Black Forest Labs API (NEW)
BLACKFOREST_API_KEY=your_blackforest_api_key

# Admin Dashboard (NEW)
ADMIN_API_KEY=your_secure_admin_key

# Razorpay (already configured)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

### Step 2: Get API Keys

**Black Forest Labs:**
1. Sign up at https://api.bfl.ml/
2. Create API key in dashboard
3. Add to `.env.local`
4. Pricing: ~$0.04 per image

**Admin Key:**
```bash
openssl rand -hex 32
```
Add generated key to `.env.local`

**Supabase Service Role:**
1. Supabase Dashboard → Settings → API
2. Copy "service_role" key
3. Add to `.env.local`

### Step 3: Database Setup

Execute the updated schema in Supabase SQL Editor:

```sql
-- Copy entire contents of database/schema.sql
-- Paste into Supabase SQL Editor
-- Click "Run"
```

**New tables created:**
- `analytics_generations` - Track each generation
- `analytics_user_activity` - User actions
- `analytics_page_views` - Page tracking
- `analytics_subscriptions` - Subscription events
- `analytics_style_stats` - Style popularity
- `analytics_background_stats` - Background popularity
- `analytics_accessory_stats` - Accessory popularity

**Updated tables:**
- `generated_images` - Now tracks full generation lifecycle

### Step 4: Test the System

```bash
# Set environment variables
export USER_TOKEN="your_user_auth_token"
export ADMIN_API_KEY="your_admin_key"

# Run test script
node test-generation.mjs
```

### Step 5: Access Admin Dashboard

1. Navigate to `http://localhost:3000/admin/dashboard`
2. Enter your `ADMIN_API_KEY`
3. View analytics!

## 📁 File Structure

```
src/
├── lib/
│   ├── ai-prompt-builder.ts      # Prompt generation logic
│   │   - buildPrompt()            # Main prompt builder
│   │   - buildNegativePrompt()    # Quality control
│   │   - generatePromptVariations() # Batch variations
│   │   - validateSelections()     # Input validation
│   │
│   ├── blackforest-api.ts         # API integration
│   │   - generateImages()         # Start generation
│   │   - checkGenerationStatus()  # Poll for results
│   │   - waitForCompletion()      # Async waiting
│   │   - generateBatch()          # Batch processing
│   │   - getOptimalParameters()   # Plan-based settings
│   │
│   └── analytics.ts               # Analytics tracking
│       - trackImageGeneration()   # Log generation events
│       - trackUserActivity()      # Log user actions
│       - getPlatformStats()       # Admin dashboard data
│       - getPopularStyles()       # Trend analysis
│       - getGenerationTrends()    # Time-series data
│
├── app/
│   ├── api/
│   │   ├── generate-images/
│   │   │   └── route.ts           # Generation endpoints
│   │   │       - POST: Start generation
│   │   │       - GET: Check status
│   │   │
│   │   └── admin/
│   │       └── analytics/
│   │           └── route.ts       # Admin API
│   │               - GET: Fetch all analytics
│   │
│   └── admin/
│       └── dashboard/
│           └── page.tsx            # Admin UI
│               - Secure login
│               - Real-time metrics
│               - Visual charts
│               - Trend analysis
│
database/
└── schema.sql                      # Complete schema with analytics

docs/
├── AI_GENERATION_SETUP.md          # Detailed setup guide
└── AI_SYSTEM_SUMMARY.md            # Quick reference

test-generation.mjs                 # Test script
```

## 🎨 AI Prompt System

### Supported Styles

| Style | Description | Use Case |
|-------|-------------|----------|
| Professional Portrait | Studio quality, sharp focus | Professional photos |
| Watercolor Art | Soft brushstrokes, artistic | Artistic prints |
| Vintage Film | Film grain, nostalgic tones | Retro aesthetic |
| Disney Pixar | 3D animated character | Fun, playful images |
| Oil Painting | Classical art style | Museum quality |
| Cyberpunk | Neon lights, futuristic | Modern, tech-savvy |
| Renaissance | Classical painting | Historical art |
| Minimalist | Clean, simple lines | Modern minimal |

### Supported Backgrounds

| Background | Environment |
|------------|-------------|
| Studio White | Clean white backdrop |
| Garden | Lush garden, flowers |
| Beach Sunset | Golden hour beach |
| Urban City | Modern cityscape |
| Cozy Home | Warm interior |
| Mountains | Alpine scenery |
| Magical Fantasy | Enchanted forest |
| Autumn Forest | Fall foliage |

### Supported Accessories

- Bow Tie
- Crown
- Bandana
- Flower Crown
- Sunglasses
- Hat
- Scarf
- Collar

### Breed Recognition

**Dogs:** Golden Retriever, Labrador, German Shepherd, Bulldog, Poodle, Husky, Beagle, Corgi

**Cats:** Persian, Siamese, Maine Coon, British Shorthair, Bengal, Ragdoll, Sphynx

## 📊 Analytics Dashboard

### Key Metrics

- **Total Users** - All registered users
- **Active Subscriptions** - Currently active plans
- **Total Generations** - All-time image generations
- **Total Revenue** - Sum of successful payments
- **Recent Activity** - Last 7/30/90 days

### Visual Analytics

1. **Generation Trends** - Images generated over time
2. **Revenue Trends** - Revenue over time
3. **Plan Distribution** - Starter vs Pro vs Max
4. **Popular Styles** - Most used artistic styles
5. **Popular Backgrounds** - Most selected backgrounds
6. **Popular Accessories** - Most chosen accessories

### Insights for Product Decisions

- **Which styles should we promote?** → Check popular styles
- **Should we add more backgrounds?** → See background usage
- **Is pricing right?** → Check plan distribution
- **What's trending?** → View generation trends
- **User retention?** → Track activity over time

## 🔐 Security

### Authentication Layers

1. **User API** - Supabase authentication required
2. **Admin API** - Bearer token with ADMIN_API_KEY
3. **Database** - Row Level Security on all tables
4. **Service Role** - Only used server-side

### Best Practices

- ✅ Admin key stored in environment variables
- ✅ Service role key never exposed to client
- ✅ Admin dashboard not linked in UI
- ✅ Rate limiting on API endpoints
- ✅ Input validation on all requests
- ✅ SQL injection protection via Supabase

## 🎯 API Reference

### Generate Images

```typescript
POST /api/generate-images
Authorization: Bearer {user_token}

Request:
{
  "selections": {
    "petType": "dog",
    "petBreed": "golden-retriever",
    "petName": "Max",
    "style": "professional-portrait",
    "background": "studio-white",
    "accessories": ["bow-tie"]
  },
  "numImages": 5
}

Response:
{
  "success": true,
  "generationId": "uuid",
  "jobIds": ["job_1", "job_2"],
  "estimatedTime": 150,
  "message": "Generating 5 images..."
}
```

### Check Generation Status

```typescript
GET /api/generate-images?id={generationId}
Authorization: Bearer {user_token}

Response:
{
  "status": "completed",
  "images": ["url1", "url2"],
  "progress": 100,
  "generationId": "uuid"
}
```

### Admin Analytics

```typescript
GET /api/admin/analytics?days=30
Authorization: Bearer {admin_api_key}

Response:
{
  "platformStats": { ... },
  "popularStyles": [ ... ],
  "popularBackgrounds": [ ... ],
  "generationTrends": [ ... ],
  "revenueTrends": [ ... ],
  "planDistribution": [ ... ]
}
```

## ⚙️ Generation Parameters

### By Plan

| Plan | Resolution | Steps | Quality | Images |
|------|-----------|-------|---------|--------|
| Starter ($15) | 1024x1024 | 30 | Good | 20 |
| Pro ($29) | 1536x1536 | 50 | Great | 40 |
| Max ($49) | 2048x2048 | 75 | Best | 100 |

### Rate Limits

- **Per Minute:** 10 requests
- **Concurrent Jobs:** 5 maximum
- **Exceeded:** Returns rate limit error

## 🐛 Troubleshooting

### Common Issues

**"Payment system configuration error"**
```bash
# Solution: Add Black Forest Labs API key
BLACKFOREST_API_KEY=your_key_here
```

**"Unauthorized" on admin dashboard**
```bash
# Solution: Check admin key matches
ADMIN_API_KEY=your_key_here
```

**"No active subscription found"**
```
Solution: User needs to purchase a plan first
```

**Analytics not loading**
```sql
-- Solution: Execute database schema
-- Copy database/schema.sql into Supabase SQL Editor
```

## 📈 Cost Estimation

### Black Forest Labs Pricing

- **Flux Pro 1.1:** ~$0.04 per image
- **Resolution:** Higher resolution = same cost
- **Steps:** More steps = longer processing, same cost

### Monthly Cost Examples

**100 images/month:**
- Cost: $4.00
- Users supported: ~20 Starter users

**1,000 images/month:**
- Cost: $40.00
- Users supported: ~50 Starter + 17 Pro users

**10,000 images/month:**
- Cost: $400.00
- Users supported: ~200 mixed users

## 🚀 Production Deployment

### Before Going Live

1. ✅ Set all environment variables
2. ✅ Execute database schema
3. ✅ Test generation flow end-to-end
4. ✅ Verify payment integration
5. ✅ Set up image storage (Supabase Storage)
6. ✅ Configure CDN for images
7. ✅ Set up error monitoring (Sentry)
8. ✅ Configure usage alerts
9. ✅ Test admin dashboard access
10. ✅ Rotate API keys from test to production

### Monitoring

- Black Forest Labs API usage
- Generation success rate
- Average processing time
- Cost per user
- Popular selections
- Revenue metrics

## 📚 Documentation

- **Setup Guide:** `AI_GENERATION_SETUP.md`
- **Quick Reference:** `AI_SYSTEM_SUMMARY.md`
- **Database Schema:** `database/schema.sql`
- **Test Script:** `test-generation.mjs`

## 🎉 Success Checklist

- [ ] Environment variables configured
- [ ] Database schema executed
- [ ] Test generation successful
- [ ] Admin dashboard accessible
- [ ] Analytics tracking working
- [ ] Payment flow integrated
- [ ] Image storage configured
- [ ] Production keys set

## 💡 Next Features to Build

1. **Image Gallery** - Display generated images to users
2. **Download Feature** - Let users download images
3. **Favorites** - Save favorite generations
4. **Regenerate** - Retry with same settings
5. **Share** - Social media integration
6. **History** - View all past generations
7. **Webhooks** - Async processing notifications
8. **Usage Dashboard** - User-facing stats

---

**🎨 Ready to generate amazing AI pet images!**

For detailed setup instructions, see `AI_GENERATION_SETUP.md`
