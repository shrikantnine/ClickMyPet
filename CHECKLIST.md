# Pre-Launch Checklist for PetPX Payment Integration

## 📋 Development Setup Checklist

### Environment Configuration
- [ ] `.env.local` file created with all required variables
- [ ] Razorpay test credentials added
- [ ] Supabase credentials added
- [ ] `.env.local` added to `.gitignore`
- [ ] Test the app starts without errors: `npm run dev`

### Database Setup
- [ ] Supabase project created
- [ ] SQL schema executed (`database/schema.sql`)
- [ ] All tables created successfully:
  - [ ] `users` table
  - [ ] `subscriptions` table
  - [ ] `payments` table
  - [ ] `user_preferences` table
  - [ ] `generated_images` table
- [ ] RLS policies enabled on all tables
- [ ] Database functions created and working
- [ ] Test triggers working (updated_at)

### Payment Integration
- [ ] Razorpay account created (test mode)
- [ ] Test API keys obtained
- [ ] Payment creation API route working
- [ ] Payment verification API route working
- [ ] Webhook endpoint created
- [ ] Test payment completes successfully
- [ ] Subscription created after payment
- [ ] Payment records stored in database

---

## 🧪 Testing Checklist

### User Journey Testing
- [ ] **Landing Page**
  - [ ] All CTAs route to `/onboarding`
  - [ ] Hero section CTA works
  - [ ] How It Works CTA works
  - [ ] Pricing section CTAs work
  - [ ] Sticky CTA appears on scroll

- [ ] **Onboarding Page** (`/onboarding`)
  - [ ] Step 1: Style selection works
  - [ ] Can select multiple styles
  - [ ] Check marks appear on selection
  - [ ] "Next" button enabled after selection
  - [ ] Step 2: Background selection works
  - [ ] Can select multiple backgrounds
  - [ ] Step 3: Accessories selection works (optional)
  - [ ] "Back" button works from all steps
  - [ ] Progress indicator updates
  - [ ] "Continue to Checkout" redirects correctly

- [ ] **Checkout Page** (`/checkout`)
  - [ ] All three plans display correctly
  - [ ] Can select a plan (one at a time)
  - [ ] Selected plan highlights
  - [ ] Order summary shows correct amount
  - [ ] Payment button enabled
  - [ ] Razorpay script loads
  - [ ] Payment modal opens

- [ ] **Payment Flow**
  - [ ] Use test card: `4111 1111 1111 1111`
  - [ ] Payment modal displays correctly
  - [ ] Payment succeeds with test card
  - [ ] Loading states work
  - [ ] Error handling works for failed payments
  - [ ] Redirects to success page after payment

- [ ] **Success Page** (`/payment-success`)
  - [ ] Success animation displays
  - [ ] Subscription ID shown
  - [ ] "What's Next" section displays
  - [ ] CTAs work
  - [ ] Auto-redirect countdown works
  - [ ] Redirects after 5 seconds

### Mobile Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Onboarding grids display correctly (2 columns)
- [ ] Touch selection works
- [ ] Sticky navigation stays at bottom
- [ ] Payment modal is mobile-friendly
- [ ] All text is readable
- [ ] Buttons are thumb-friendly

### Desktop Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Onboarding grids display correctly (4 columns)
- [ ] Hover effects work
- [ ] Payment modal centers correctly
- [ ] All layouts look good

### Database Testing
- [ ] Check `payments` table after test payment
  - [ ] Order ID stored
  - [ ] Payment ID stored
  - [ ] Status is "paid"
  - [ ] Amount is correct
- [ ] Check `subscriptions` table
  - [ ] Subscription created
  - [ ] Plan details correct
  - [ ] Image count correct
  - [ ] Status is "active"
- [ ] Check RLS policies
  - [ ] Users can only see their own data
  - [ ] Cannot modify payments directly
  - [ ] Cannot modify subscriptions directly

---

## 🔐 Security Checklist

### Code Security
- [ ] Pricing defined in `src/lib/pricing.ts` only
- [ ] No hardcoded prices in client components
- [ ] All API routes check authentication
- [ ] Payment signature verification works
- [ ] Server-side validation for all critical operations
- [ ] Environment variables not exposed to client
- [ ] Only public keys in client-side code

### Database Security
- [ ] RLS enabled on all tables
- [ ] Policies prevent unauthorized access
- [ ] Database functions use SECURITY DEFINER
- [ ] No direct client modifications to sensitive tables
- [ ] User ID checks in all policies

### Payment Security
- [ ] HMAC signature verification implemented
- [ ] Razorpay secret key never exposed
- [ ] Webhook signature verification (if using webhooks)
- [ ] Amount validation server-side
- [ ] Plan validation server-side

---

## 📱 Responsive Design Checklist

- [ ] Onboarding page responsive
  - [ ] Desktop: 4-column grid
  - [ ] Tablet: 3-column grid
  - [ ] Mobile: 2-column grid
- [ ] Checkout page responsive
  - [ ] Desktop: 3-column layout
  - [ ] Tablet: 2-column layout
  - [ ] Mobile: Stacked layout
- [ ] Navigation responsive
  - [ ] Bottom navigation works on all sizes
  - [ ] Buttons accessible
  - [ ] Text readable
- [ ] Images scale correctly
- [ ] No horizontal scroll
- [ ] Touch targets at least 44x44px

---

## 🚀 Pre-Production Checklist

### Before Going Live
- [ ] Switch to Razorpay **Live Mode**
  - [ ] Complete KYC verification
  - [ ] Get live API credentials
  - [ ] Update environment variables
  - [ ] Test with real payment (small amount)
- [ ] Enable production error tracking
- [ ] Set up monitoring/analytics
- [ ] Configure email notifications
- [ ] Set up customer support email
- [ ] Add refund policy page
- [ ] Test refund process
- [ ] Backup database schema
- [ ] Document API endpoints
- [ ] Create runbook for common issues

### SSL & Security
- [ ] SSL certificate active (HTTPS)
- [ ] Verify SSL on all pages
- [ ] Test payment on production domain
- [ ] Check CSP headers
- [ ] Verify CORS settings

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Code splitting working
- [ ] API routes fast (<200ms)
- [ ] Database queries optimized
- [ ] Caching configured

### Legal & Compliance
- [ ] Terms & Conditions page complete
- [ ] Privacy Policy page complete
- [ ] GDPR compliance (if applicable)
- [ ] Payment terms clear
- [ ] Refund policy stated
- [ ] Contact information visible

---

## 🎯 Launch Day Checklist

### Final Checks
- [ ] All environment variables set correctly
- [ ] Database backups configured
- [ ] Monitoring alerts active
- [ ] Error logging working
- [ ] Support email monitored
- [ ] Payment notifications working
- [ ] Test complete user journey one more time
- [ ] Team briefed on support procedures

### Post-Launch Monitoring
- [ ] Watch for payment errors
- [ ] Monitor database growth
- [ ] Check Razorpay dashboard
- [ ] Review user feedback
- [ ] Track conversion rates
- [ ] Monitor page load times
- [ ] Check error logs daily

---

## 📊 Metrics to Track

### Payment Metrics
- [ ] Successful payments
- [ ] Failed payments
- [ ] Average order value
- [ ] Most popular plan
- [ ] Refund requests
- [ ] Conversion rate (checkout → payment)

### User Metrics
- [ ] Onboarding completion rate
- [ ] Drop-off points
- [ ] Average time to complete
- [ ] Mobile vs desktop usage
- [ ] Most popular styles/backgrounds

### Technical Metrics
- [ ] API response times
- [ ] Database query times
- [ ] Error rates
- [ ] Page load speeds
- [ ] Uptime percentage

---

## ✅ When Everything is Complete

### You Should Be Able To:
1. ✅ Click any CTA and complete full journey
2. ✅ Select preferences on onboarding page
3. ✅ Choose a plan on checkout
4. ✅ Complete test payment successfully
5. ✅ See success page with confirmation
6. ✅ Verify subscription in database
7. ✅ See payment record with correct details
8. ✅ Test on mobile and desktop
9. ✅ Verify all security measures working
10. ✅ Handle errors gracefully

---

## 🆘 Troubleshooting Resources

If issues occur, check:
1. Browser console for errors
2. Network tab for API failures
3. Supabase logs for database errors
4. Terminal for server errors
5. Razorpay dashboard for payment status

Documentation files:
- `QUICKSTART.md` - Quick setup guide
- `PAYMENT_SETUP.md` - Detailed setup
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `USER_FLOW_DIAGRAM.md` - Visual flow

---

**Ready to launch?** Make sure all critical items are checked! ✅
