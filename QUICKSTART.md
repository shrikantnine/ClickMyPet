# Quick Start Guide - PetPX Payment Integration

## 🎯 What's Been Implemented

Complete user journey from CTA click → Preferences → Payment → Success

## ⚡ 5-Minute Setup (Development)

### Step 1: Install Dependencies (Already Done ✅)
```bash
npm install
```

### Step 2: Get Razorpay Test Credentials

1. Sign up at https://razorpay.com
2. Go to Dashboard → Settings → API Keys
3. Click "Generate Test Key"
4. Copy both Key ID and Secret

### Step 3: Get Supabase Credentials

1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy Project URL and anon/public key

### Step 4: Create Environment File

Create `.env.local` in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Razorpay Test Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

### Step 5: Setup Database

1. Open Supabase dashboard
2. Click "SQL Editor" in sidebar
3. Copy contents of `database/schema.sql`
4. Paste and click "Run"
5. Wait for "Success" message

### Step 6: Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Testing the Flow

### Test Journey:
1. Click "Create Pet Portraits Now" on homepage
2. Complete 3-step onboarding (select styles, backgrounds, accessories)
3. Click "Continue to Checkout"
4. Select a plan (Pro recommended)
5. Click "Proceed to Secure Payment"
6. Use Razorpay test card:
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
7. Complete payment
8. See success page

### Check Results:
1. Open Supabase dashboard
2. Go to Table Editor
3. Check these tables:
   - `payments` - Should have your payment record
   - `subscriptions` - Should have your subscription

## 📱 What You'll See

### Onboarding Page (/onboarding)
- Step 1: Choose from 8 AI styles with pet photos
- Step 2: Select from 8 background options
- Step 3: Pick accessories (optional)
- Bottom sticky navigation with Back/Next buttons

### Checkout Page (/checkout)
- 3 pricing cards (Starter/Pro/Max)
- Click-to-select functionality
- Order summary
- Razorpay payment modal

### Success Page (/payment-success)
- Animated success checkmark
- What's next section
- Auto-redirect after 5 seconds

## 🔐 Security Features Active

✅ All pricing stored server-side only
✅ Payment signature verification
✅ Row Level Security on database
✅ Server-side authentication
✅ Encrypted payment data
✅ No client-side price manipulation possible

## 🎨 Responsive Design

✅ Mobile-first layout
✅ Sticky navigation on mobile and desktop
✅ Touch-friendly selection
✅ Grid layouts adapt to screen size
✅ Full-screen experience

## 🚨 Common Issues

### "Payment modal doesn't open"
- Check browser console for errors
- Verify Razorpay script loaded
- Check `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set

### "Database error"
- Ensure you ran `database/schema.sql`
- Check Supabase credentials are correct
- Verify RLS policies are enabled

### "Payment succeeds but no subscription"
- Check Supabase logs in dashboard
- Verify database function was created
- Check API route logs in terminal

## 📚 Next Steps

After successful testing:

1. **Add Authentication** - Implement proper user login
2. **User Dashboard** - Show subscription details
3. **Image Generation** - Implement actual AI generation
4. **Image Storage** - Use Supabase Storage
5. **Email Notifications** - Send payment confirmations
6. **Go Live** - Switch to Razorpay live keys

## 💡 Pro Tips

- **Use Test Mode**: Keep using test keys until ready for production
- **Check Database**: Always verify data is being stored correctly
- **Console Logs**: Check browser console for any errors
- **Network Tab**: Monitor API calls in browser DevTools
- **Supabase Logs**: Check real-time logs in Supabase dashboard

## 🎉 You're Ready!

The complete payment flow is now integrated and ready to test. All security measures are in place, and the user experience is fully responsive.

For detailed documentation, see:
- [PAYMENT_SETUP.md](./PAYMENT_SETUP.md) - Complete setup guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was built

---

**Questions?** Check the documentation files or create an issue!
