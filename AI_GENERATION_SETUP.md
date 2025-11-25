# AI Image Generation & Admin Dashboard Setup

## Overview
This document covers the setup for Black Forest Labs Flux API integration and the admin dashboard for tracking product analytics.

## New Environment Variables Required

Add these to your `.env.local` file:

```bash
# Black Forest Labs API
BLACKFOREST_API_KEY=your_blackforest_api_key_here

# Admin Dashboard Access
ADMIN_API_KEY=your_secure_admin_key_here

# Supabase Service Role (for analytics - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Getting Black Forest Labs API Key

1. **Sign up at Black Forest Labs:**
   - Visit: https://api.bfl.ml/
   - Create an account
   - Go to API Keys section
   - Generate a new API key

2. **API Pricing:**
   - Flux Pro 1.1: ~$0.04 per image
   - Check current pricing: https://api.bfl.ml/pricing

3. **Add to `.env.local`:**
   ```bash
   BLACKFOREST_API_KEY=bfl_xxxxxxxxxxxxxxxxxxxxx
   ```

### Setting Up Admin API Key

1. **Generate a secure random key:**
   ```bash
   # On macOS/Linux
   openssl rand -hex 32
   
   # Or use online generator (ensure it's secure)
   ```

2. **Add to `.env.local`:**
   ```bash
   ADMIN_API_KEY=your_generated_secure_key_here
   ```

3. **Keep this key secret!** Only share with authorized admins.

### Getting Supabase Service Role Key

1. **Go to Supabase Dashboard:**
   - Navigate to: https://supabase.com/dashboard
   - Select your project
   - Go to Settings → API

2. **Copy Service Role Key:**
   - Find "service_role" key (NOT the anon key)
   - This key bypasses Row Level Security for server-side operations
   - **Never expose this key to the client!**

3. **Add to `.env.local`:**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Database Setup

### 1. Execute Updated Schema

The `database/schema.sql` file has been updated with new analytics tables. Execute it in your Supabase SQL Editor:

**New Tables Added:**
- `analytics_generations` - Track each image generation request
- `analytics_user_activity` - Track user actions
- `analytics_page_views` - Track page views
- `analytics_subscriptions` - Track subscription events
- `analytics_style_stats` - Aggregated style popularity
- `analytics_background_stats` - Aggregated background popularity
- `analytics_accessory_stats` - Aggregated accessory popularity

**New Functions Added:**
- `increment_style_count()` - Auto-increment style usage
- `increment_background_count()` - Auto-increment background usage
- `increment_accessory_count()` - Auto-increment accessory usage
- Updated `decrement_image_count()` - Now supports multiple images

### 2. Execute Schema
```sql
-- Copy the entire contents of database/schema.sql
-- Paste into Supabase SQL Editor
-- Click "Run" to execute
```

## Accessing the Admin Dashboard

### URL
The admin dashboard is accessible at a hidden URL:
```
https://your-domain.com/admin/dashboard
```

**Note:** This route is not linked anywhere in the UI for security.

### Login Process
1. Navigate to `/admin/dashboard`
2. Enter the `ADMIN_API_KEY` value
3. Access granted to full analytics dashboard

### Dashboard Features

**Key Metrics:**
- Total users
- Active subscriptions
- Total generations
- Total revenue
- Recent activity stats

**Analytics Charts:**
- Generation trends over time
- Revenue trends over time
- Plan distribution
- Popular styles
- Popular backgrounds
- Popular accessories

**Filters:**
- Last 7 days
- Last 30 days
- Last 90 days

## API Endpoints

### Generate Images
**Endpoint:** `POST /api/generate-images`

**Authentication:** Required (Supabase auth)

**Request Body:**
```json
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
```

**Response:**
```json
{
  "success": true,
  "generationId": "uuid",
  "jobIds": ["job_1", "job_2"],
  "estimatedTime": 150,
  "message": "Generating 5 images. This will take approximately 3 minutes."
}
```

### Check Generation Status
**Endpoint:** `GET /api/generate-images?id={generationId}`

**Authentication:** Required (Supabase auth)

**Response:**
```json
{
  "status": "completed",
  "images": ["url1", "url2", "url3"],
  "progress": 100,
  "generationId": "uuid"
}
```

### Admin Analytics API
**Endpoint:** `GET /api/admin/analytics?days=30`

**Authentication:** Required (Admin API Key in Bearer token)

**Headers:**
```
Authorization: Bearer your_admin_api_key
```

**Response:** Full analytics data (see dashboard for structure)

## AI Prompt Generation

### Supported Styles
- Professional Portrait
- Watercolor Art
- Vintage Film
- Disney Pixar
- Oil Painting
- Cyberpunk
- Renaissance
- Minimalist

### Supported Backgrounds
- Studio White
- Garden
- Beach Sunset
- Urban City
- Cozy Home
- Mountains
- Magical Fantasy
- Autumn Forest

### Supported Accessories
- Bow Tie
- Crown
- Bandana
- Flower Crown
- Sunglasses
- Hat
- Scarf
- Collar

### Custom Breed Support
The system includes optimized prompts for popular breeds:
- Dogs: Golden Retriever, Labrador, German Shepherd, Bulldog, Poodle, Husky, Beagle, Corgi
- Cats: Persian, Siamese, Maine Coon, British Shorthair, Bengal, Ragdoll, Sphynx

## Generation Parameters by Plan

**Starter ($15):**
- Resolution: 1024x1024
- Inference Steps: 30
- Guidance Scale: 7.0
- 20 images included

**Pro ($29):**
- Resolution: 1536x1536
- Inference Steps: 50
- Guidance Scale: 7.5
- 40 images included

**Max ($49):**
- Resolution: 2048x2048
- Inference Steps: 75
- Guidance Scale: 8.0
- 100 images included

## Rate Limiting

**API Limits:**
- 10 requests per minute
- 5 concurrent generation jobs max

**Exceeded Limits:**
- Returns error: "Rate limit exceeded. Please try again in a moment."

## Error Handling

**Common Errors:**

1. **"Payment system configuration error"**
   - Solution: Check BLACKFOREST_API_KEY is set

2. **"No active subscription found"**
   - Solution: User needs to purchase a plan first

3. **"You have used all images in your plan"**
   - Solution: User needs to upgrade or purchase more images

4. **"Generation failed"**
   - Solution: Check Black Forest Labs API status, verify prompt validity

## Analytics Tracking

**Automatically Tracked:**
- Each generation request (style, background, accessories)
- User activity and page views
- Subscription events (created, upgraded, cancelled)
- Popular selections aggregated in real-time

**Privacy:**
- User-specific data requires authentication
- Analytics tables use Row Level Security
- Admin dashboard requires API key

## Testing

### Test Generation Flow

1. **Set up environment variables**
2. **Execute database schema**
3. **Create test user with active subscription**
4. **Make generation request:**
   ```bash
   curl -X POST https://your-domain.com/api/generate-images \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer user_token" \
     -d '{
       "selections": {
         "petType": "dog",
         "style": "professional-portrait",
         "background": "studio-white"
       },
       "numImages": 1
     }'
   ```
5. **Poll for completion:**
   ```bash
   curl https://your-domain.com/api/generate-images?id=generation_uuid \
     -H "Authorization: Bearer user_token"
   ```

### Test Admin Dashboard

1. **Navigate to `/admin/dashboard`**
2. **Enter ADMIN_API_KEY**
3. **Verify all metrics load correctly**

## Production Considerations

1. **Image Storage:**
   - Set up Supabase Storage bucket for generated images
   - Configure public access policies
   - Implement image optimization/compression

2. **Webhook Setup:**
   - Configure Black Forest Labs webhooks for async processing
   - Reduces polling requirements

3. **Cost Management:**
   - Monitor Black Forest Labs API usage
   - Set usage alerts in dashboard
   - Implement spending caps per user

4. **Scaling:**
   - Consider background job queue (Bull, BullMQ)
   - Implement Redis caching for analytics
   - Use CDN for generated images

5. **Security:**
   - Rotate ADMIN_API_KEY regularly
   - Never commit API keys to git
   - Use environment-specific keys

## Support

For issues with:
- **Black Forest Labs API:** https://docs.bfl.ml/
- **Supabase:** https://supabase.com/docs
- **Admin Dashboard:** Check browser console for errors

## Next Steps

1. ✅ Set up all environment variables
2. ✅ Execute database schema updates
3. ✅ Test image generation flow
4. ✅ Access admin dashboard
5. ✅ Monitor analytics and user behavior
6. 🔄 Implement image storage integration
7. 🔄 Set up production monitoring
