# PetPX Payment Integration Setup Guide

This guide will help you set up the complete payment flow with Razorpay integration for PetPX.

## Prerequisites

- Razorpay account (sign up at https://razorpay.com)
- Supabase project (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration (Get from Razorpay Dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Getting Razorpay Credentials:

1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate API Keys
4. Copy the `Key ID` (public) and `Key Secret` (private)
5. **Important**: Never expose `RAZORPAY_KEY_SECRET` to the client side

### Getting Supabase Credentials:

1. Log in to your Supabase Dashboard
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

## Step 2: Database Setup

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database/schema.sql`
4. Paste and run the SQL script in the SQL Editor

This will create:
- `users` table (extends auth.users)
- `subscriptions` table
- `payments` table
- `user_preferences` table
- `generated_images` table
- Row Level Security (RLS) policies
- Database functions for subscription management

## Step 3: Install Dependencies

All required dependencies should already be installed. If not, run:

```bash
npm install
```

The project includes:
- `razorpay` - For payment processing
- `@supabase/ssr` - For server-side Supabase client
- `@supabase/supabase-js` - Supabase JavaScript client

## Step 4: User Journey Flow

### Flow Overview:

1. **Landing Page** → User clicks any CTA button
2. **Onboarding Page** (`/onboarding`) → User selects preferences:
   - Step 1: Choose styles (superhero, royal, realistic, etc.)
   - Step 2: Select backgrounds (studio, outdoor, luxury, etc.)
   - Step 3: Add accessories (optional - glasses, hat, chain, etc.)
3. **Checkout Page** (`/checkout`) → User:
   - Selects a pricing plan (Starter/Pro/Max)
   - Reviews order summary
   - Clicks "Proceed to Secure Payment"
   - Razorpay checkout modal opens
   - Completes payment
4. **Payment Success** (`/payment-success`) → User sees:
   - Success confirmation
   - Subscription details
   - Next steps
   - Auto-redirect to dashboard

## Step 5: Security Features Implemented

### 1. Server-Side Pricing Configuration
- All pricing data is stored in `src/lib/pricing.ts`
- Prices are validated server-side only
- Client cannot modify pricing information

### 2. Row Level Security (RLS)
- Users can only view their own data
- Payment and subscription modifications require server-side functions
- Database functions use `SECURITY DEFINER` for controlled access

### 3. Payment Verification
- Razorpay signature verification using HMAC SHA256
- Server-side validation before creating subscriptions
- Payment records tracked with status updates

### 4. Environment Security
- Sensitive keys (Razorpay Secret) are never exposed to client
- Only public keys are accessible in browser
- API routes require authentication

## Step 6: Testing the Integration

### Test Mode (Recommended):

1. Use Razorpay Test Mode credentials
2. Test card details (Razorpay Test Cards):
   - Card Number: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

### Testing Checklist:

- [ ] User can complete onboarding flow
- [ ] All three plans show correct pricing
- [ ] Payment modal opens correctly
- [ ] Test payment succeeds
- [ ] Subscription is created in database
- [ ] User redirects to success page
- [ ] Payment record is stored with correct status

## Step 7: Going Live

### Before Production:

1. **Switch to Live Mode in Razorpay:**
   - Complete KYC verification
   - Get live API credentials
   - Update environment variables with live keys

2. **Enable Payment Methods:**
   - Configure accepted payment methods in Razorpay Dashboard
   - Enable UPI, Cards, Net Banking, Wallets as needed

3. **Set up Webhooks (Optional but Recommended):**
   - In Razorpay Dashboard, go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment.authorized`, `payment.failed`, `payment.captured`

4. **Configure Refund Policy:**
   - Implement refund logic in `src/lib/razorpay.ts`
   - 7-day money-back guarantee is mentioned in UI

## API Routes Documentation

### POST `/api/payment/create-order`
Creates a Razorpay order for a selected plan.

**Request Body:**
```json
{
  "planId": "starter" | "pro" | "max"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "order_xxxxx",
  "amount": 74900,
  "currency": "INR",
  "keyId": "rzp_test_xxxxx",
  "planName": "Starter",
  "userEmail": "user@example.com",
  "userName": "User Name"
}
```

### POST `/api/payment/verify`
Verifies payment signature and creates subscription.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "subscriptionId": "uuid-xxx"
}
```

## Pricing Plans

All plans include a 7-day money-back guarantee:

| Plan | Price | Images | Styles | Resolution |
|------|-------|--------|--------|------------|
| **Starter** | $19 | 5 | 2 | HD |
| **Pro** | $37 | 25 | 8 | 2K |
| **Max** | $59 | 60 | 15+ | 4K |

## Troubleshooting

### Payment Modal Doesn't Open:
- Check if Razorpay script is loaded (check browser console)
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set correctly
- Ensure user is authenticated

### Payment Succeeds but Subscription Not Created:
- Check Supabase logs for function errors
- Verify database schema is properly created
- Check API route logs for errors

### Authentication Issues:
- Ensure Supabase auth is configured
- Check if user is logged in before accessing checkout
- Verify RLS policies are set correctly

## Support

For issues or questions:
- Check Razorpay documentation: https://razorpay.com/docs/
- Check Supabase documentation: https://supabase.com/docs
- Contact support: support@petpx.com

## Next Steps

After successful payment integration:
1. Implement actual AI image generation functionality
2. Create user dashboard to view subscriptions
3. Add image generation interface
4. Implement image storage and retrieval
5. Add email notifications for payments
6. Set up analytics and monitoring
