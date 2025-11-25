# 🧪 Testing Your Dashboard

## Quick Test (5 minutes)

Follow these steps to test the complete user flow:

### 1. Start the Development Server

```bash
cd "/Users/shrikantshinde/Downloads/PET PX/petpx"
npm run dev
```

Open http://localhost:3000

### 2. Go to Checkout Page

Navigate to: http://localhost:3000/checkout

### 3. Use Test Mode

1. Select any plan (Starter/Pro/Premium)
2. Click the **yellow "🧪 Test Mode - Skip Payment"** button
3. You'll be redirected to `/payment-success`
4. After 5 seconds, auto-redirects to `/dashboard`

### 4. Test Dashboard

**You should see:**
- ✅ Welcome banner showing "Pro" plan with 35/40 credits
- ✅ 3 quick stats cards
- ✅ Generate tab selected by default

### 5. Upload a Pet Photo

1. Click "Choose Photo" or drag & drop any pet image
2. You should see a preview of your image

### 6. Select Style Options

**Step 1: Choose Style**
- Click any style (e.g., "Professional Portrait")
- Button should highlight with blue border

**Step 2: Choose Background**
- Click any background (e.g., "Studio White")
- Button should highlight with purple border

**Step 3: Add Accessories (Optional)**
- Click any accessory (e.g., "Bow Tie")
- Button should highlight with pink border

### 7. Generate Images

1. Click the blue "Generate AI Portraits (34 credits left)" button
2. Watch for:
   - Button changes to "Generating with AI..."
   - Loading spinner appears
   - After 5 seconds: Alert "🎉 Image generation started!"
   - Another alert: "✨ Your images are ready!"
   - Automatically switches to Gallery tab

### 8. Check Gallery

**You should see:**
- ✅ Your uploaded image displayed in a grid
- ✅ Download, Share, and Heart icons (not yet functional)
- ✅ Created timestamp

### 9. Check Subscription Tab

Click "Subscription" tab to see:
- ✅ Current plan details (Pro - $19/month)
- ✅ Usage statistics (1 image generated, 34 remaining)
- ✅ Billing information (mock data)
- ✅ Upgrade buttons (links to /checkout)

---

## 🎯 What's Working

### ✅ Fully Functional
- Test mode checkout flow
- Dashboard rendering with 3 tabs
- File upload with preview
- Style/Background/Accessory selection
- Credits validation
- Generation API calls
- Job polling (5-second simulation)
- Gallery display
- Tab navigation
- Responsive design

### ⚠️ Simulation Mode
Without a Black Forest Labs API key, the system runs in **simulation mode**:
- ✅ All UI flows work perfectly
- ✅ Credits decrement correctly
- ✅ Job polling works
- ⚠️ "Generated" image is just your uploaded image
- ⚠️ Completes in 5 seconds instead of 2-3 minutes

**To enable real AI generation:**
1. Get API key from https://bfl.ml
2. Add to `.env.local`: `BLACKFOREST_API_KEY=your_key`
3. Restart server: `npm run dev`

### 🚧 Not Yet Implemented
- Download button functionality
- Share button functionality
- Favorite toggle functionality
- Delete images
- Real user authentication (uses test mode)
- Email notifications
- Subscription upgrades
- Add credits

---

## 🐛 Expected Behaviors

### Test Mode Flow
```
/checkout 
  → Click test button 
  → /payment-success?subscription=test_pro_1234567890
  → Wait 5s
  → /dashboard
```

### Generation Flow
```
Upload image 
  → Select options 
  → Click generate
  → API uploads to Supabase Storage (or simulates)
  → API calls generation endpoint
  → Returns jobId
  → Polling starts after 5s
  → Checks status every 10s
  → When complete: alert + switch to Gallery tab
```

### Credits Flow
```
Initial: 35/40 credits (test mode)
After generation: 34/40 credits
Button updates: "34 credits left"
When 0 credits: Button disabled + red warning
```

---

## 📊 Console Logs to Watch

Open browser console (F12) and look for:

```
✅ Good logs:
- "User loaded: test-user-id"
- "Subscription: Pro, 35/40 credits"
- "File uploaded successfully"
- "Generation started: job_..."
- "Polling status..."
- "Generation completed!"

⚠️ Warning logs:
- "No valid API key found - running in SIMULATION mode"
  → Normal without BLACKFOREST_API_KEY

❌ Error logs:
- "Failed to upload image: ..."
  → Check Supabase credentials
- "No active subscription found"
  → Test mode should prevent this
- "Polling error: ..."
  → Check API endpoint exists
```

---

## 🔧 Troubleshooting

### Dashboard shows "Loading..."
- Check browser console for errors
- Verify `/src/app/dashboard/page.tsx` exists
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Upload button doesn't work
- Check file type (should accept images: jpg, png, gif, webp)
- Check file size (should be reasonable, < 10MB)
- Check console for errors

### Generate button is disabled
- Make sure you've uploaded a file
- Make sure you've selected a style
- Check credits aren't at 0 (test mode gives 35)

### Polling never completes
- Simulation mode should complete in 5 seconds
- Check console for errors
- Verify `/api/generate-simple` endpoint exists
- Try refreshing the page and checking Gallery tab manually

### Gallery is empty
- Generation must complete first
- Try generating an image
- Check console for "Generation completed!" message
- In test mode, loadUserData() creates mock images array

---

## 🎨 Visual Checklist

When testing, verify these UI elements:

**Dashboard Header:**
- [ ] "Welcome back!" greeting
- [ ] Credits displayed (e.g., "35 credits remaining")
- [ ] Purple gradient background

**Quick Stats Cards:**
- [ ] "Active Plan" card shows plan name
- [ ] "Images Generated" shows count
- [ ] "Usage" shows percentage with progress bar

**Generate Tab:**
- [ ] Upload area with dotted border
- [ ] Preview image appears after upload
- [ ] 8 style options in 2 columns on mobile, 4 on desktop
- [ ] 8 background options with purple theme
- [ ] 8 accessory options with pink theme
- [ ] Generate button with gradient background
- [ ] Credits counter in button text

**Gallery Tab:**
- [ ] Grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- [ ] Images display with rounded corners
- [ ] Action buttons appear on hover
- [ ] Timestamps shown below images

**Subscription Tab:**
- [ ] Current plan card with checkmarks
- [ ] Usage statistics
- [ ] Billing info (even if mock)
- [ ] Upgrade/Add credits buttons

---

## ✨ Success Criteria

Your dashboard is working correctly if:

1. ✅ Test button redirects to dashboard
2. ✅ Dashboard loads without errors
3. ✅ You can upload a pet photo
4. ✅ You can select style/background/accessory
5. ✅ Generate button triggers API call
6. ✅ Alert appears after generation
7. ✅ Gallery tab shows the image
8. ✅ Credits decrement from 35 to 34
9. ✅ All 3 tabs are clickable and display correctly
10. ✅ Mobile responsive (test by resizing browser)

---

## 🚀 Next Steps After Testing

Once you've verified everything works:

1. **Add Supabase credentials** to `.env.local`
2. **Create database tables** using `database/schema.sql`
3. **Create storage bucket** named `pet-photos`
4. **Add Black Forest Labs API key** for real generation
5. **Test real user flow** (not just test mode)
6. **Implement gallery actions** (download/share/favorite)
7. **Add authentication** (replace test mode)
8. **Deploy to production** (Vercel recommended)

---

## 📞 Need Help?

Check these files for implementation details:
- `SETUP_GUIDE.md` - Complete setup instructions
- `src/app/dashboard/page.tsx` - Dashboard frontend code
- `src/app/api/upload-image/route.ts` - Upload API
- `src/app/api/generate-simple/route.ts` - Generation API
- `database/schema.sql` - Database schema

**Common Issues:**
- If nothing works, check `npm run dev` is running
- If uploads fail, Supabase credentials needed
- If generation fails, that's expected without API key
- If styling looks broken, check Tailwind CSS is working

---

**Happy Testing! 🎉**

Your dashboard is production-ready for testing. All core functionality is implemented and working in simulation mode.
