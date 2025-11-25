# Razorpay International Payments Setup Guide

## 🌍 Enable International Payments on Razorpay

This guide will help you set up Razorpay to accept international credit cards and PayPal payments from US and European customers.

---

## Part 1: Razorpay Account Setup for International Payments

### Step 1: Complete KYC Verification

1. **Log in** to your Razorpay Dashboard: https://dashboard.razorpay.com
2. Navigate to **Settings** → **Account & Settings**
3. Complete **Business KYC** (required for international payments):
   - Business PAN
   - Business address proof
   - Bank account details
   - GST certificate (if applicable)
4. Wait for KYC approval (usually 24-48 hours)

### Step 2: Enable International Payments

1. Go to **Settings** → **Payment Methods**
2. Find **International Cards** section
3. Click **Enable International Cards**
4. You'll need to provide additional documents:
   - **IEC (Import Export Code)** - Get from DGFT website
   - **Website/App Details** - Your PetPX website
   - **Business Model Description**
   - **Expected Monthly Volume**

**Important Documents for International Payments:**
- Import Export Code (IEC)
- Website URL with products/services clearly visible
- Business registration documents
- Bank account proof

### Step 3: Configure Payment Methods

In **Settings** → **Payment Methods**, enable:

#### ✅ Credit/Debit Cards
- [x] Visa
- [x] Mastercard
- [x] American Express
- [x] Discover
- [x] Diners Club
- [x] International Cards

#### ✅ Digital Wallets (if available)
- [x] PayPal (requires separate integration)
- [x] Apple Pay (for Safari users)
- [x] Google Pay (for Chrome users)

---

## Part 2: Enable PayPal Integration

Razorpay supports PayPal through their International Payment Gateway.

### Method 1: Razorpay PayPal Integration (Recommended)

1. **Contact Razorpay Support**:
   - Email: support@razorpay.com
   - Subject: "Enable PayPal for International Payments"
   - Include your Razorpay Account ID

2. **Provide Business Details**:
   - Website URL: your-domain.com
   - Business nature: SaaS - AI Pet Photo Generation
   - Expected transaction volume
   - Target markets: US, Europe

3. **PayPal Account Requirements**:
   - You need a **PayPal Business Account**
   - Link it to your Razorpay account
   - Configure webhook URLs

4. **Enable in Dashboard**:
   - Once approved, go to **Settings** → **Payment Methods**
   - Enable **PayPal** under International Methods
   - Configure PayPal settings

### Method 2: Direct PayPal Integration (Alternative)

If Razorpay doesn't support PayPal in your region, you can add PayPal separately:

1. **Create PayPal Business Account**: https://www.paypal.com/business
2. **Get PayPal API Credentials**:
   - Log in to PayPal Developer Portal
   - Create REST API app
   - Get Client ID and Secret
3. **Add Dual Payment Options** in your checkout:
   - Option 1: Razorpay (Cards)
   - Option 2: PayPal (Separate)

---

## Part 3: Configure Currency Settings

### Enable USD Currency

1. Go to **Settings** → **Payment Configuration**
2. Under **Multi-Currency Settings**:
   - Enable **USD** currency
   - Set conversion rates (auto or manual)
   - Configure settlement currency (INR or USD)

3. **Settlement Options**:
   - **Option A**: Settle in INR (Razorpay converts automatically)
   - **Option B**: Settle in USD (requires USD bank account)

### Dynamic Currency Conversion (DCC)

1. Enable **DCC** in Settings
2. This allows customers to see prices in their local currency
3. Supported currencies:
   - USD (United States)
   - EUR (Europe)
   - GBP (United Kingdom)
   - AUD (Australia)
   - CAD (Canada)

---

## Part 4: Code Configuration

### Environment Variables

Update your `.env.local`:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Payment Configuration
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
NEXT_PUBLIC_ENABLE_INTERNATIONAL_CARDS=true
NEXT_PUBLIC_ENABLE_PAYPAL=true
```

### Payment Method Configuration

The code has been updated in `src/app/checkout/page.tsx` to:

✅ **Enable International Cards**:
- Visa, Mastercard, Amex, Discover
- 3D Secure authentication
- OTP verification for security

✅ **Disable Local Payment Methods** (for international focus):
- UPI disabled
- Net Banking disabled
- Wallets disabled

✅ **Priority Display**:
- Cards shown first
- International card logos prominent
- Streamlined checkout experience

---

## Part 5: Testing International Payments

### Test Mode Setup

1. Use **Test API Keys** from Dashboard
2. Enable test mode for international cards

### Test Cards for International Payments

Razorpay provides test cards for different scenarios:

#### Successful International Card Payments:
```
Card Number: 4242 4242 4242 4242 (Visa)
Card Number: 5555 5555 5555 4444 (Mastercard)
Card Number: 3782 822463 10005 (Amex)
Card Number: 6011 1111 1111 1117 (Discover)
CVV: Any 3 digits
Expiry: Any future date
```

#### Test 3D Secure Flow:
```
Card Number: 4000 0027 6000 3184
This will trigger 3DS authentication
```

#### Test Failed Payment:
```
Card Number: 4000 0000 0000 0002
This will simulate a declined card
```

---

## Part 6: Pricing & Fees Structure

### Razorpay International Payment Fees

**Domestic Cards (India):**
- 2% + GST per transaction

**International Cards:**
- 3% - 4% + GST per transaction
- Additional gateway fees may apply

**PayPal:**
- ~4.4% + $0.30 per transaction
- Currency conversion fees

**Pricing Consideration:**
Your current prices:
- Starter: $19 → You receive ~$18.20 (after 4% fee)
- Pro: $37 → You receive ~$35.52
- Max: $59 → You receive ~$56.64

**Recommendation:** Consider pricing to account for fees or pass fees to customer.

---

## Part 7: Compliance & Regulations

### PCI-DSS Compliance

Razorpay is PCI-DSS Level 1 compliant, which means:
- ✅ Card data is securely processed
- ✅ No card details stored on your servers
- ✅ Tokenization for recurring payments
- ✅ Fraud detection built-in

### GDPR Compliance (for EU customers)

1. **Update Privacy Policy**:
   - Mention Razorpay as payment processor
   - Explain data handling
   - User rights (access, deletion)

2. **Cookie Consent**:
   - Add cookie banner for EU visitors
   - Razorpay checkout uses cookies

3. **Data Storage**:
   - Data stored in Razorpay's secure servers
   - Compliant with EU data regulations

### US Compliance

- **Sales Tax**: Calculate and collect sales tax for US states
- **Consumer Protection**: Clear refund policy
- **Terms of Service**: Include payment terms

---

## Part 8: Fraud Prevention

Razorpay provides built-in fraud detection:

### Enable Fraud Detection

1. Go to **Settings** → **Fraud Prevention**
2. Enable **Dynamic Fraud Detection**
3. Configure rules:
   - Block suspicious IPs
   - Limit transaction attempts
   - Email domain verification
   - Velocity checks

### Recommended Settings:

```
✅ Enable 3D Secure for international cards
✅ Email verification required
✅ Block VPN/Proxy IPs (optional)
✅ Limit: Max 3 payment attempts per hour
✅ Flag: Transactions over $100
✅ Require CVV for all cards
```

---

## Part 9: Webhook Configuration

### Set Up Webhooks for Payment Events

1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
   - `refund.processed`

4. **Get Webhook Secret** and add to `.env.local`:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## Part 10: Go Live Checklist

### Before Enabling International Payments:

- [ ] KYC completed and approved
- [ ] IEC (Import Export Code) submitted
- [ ] International cards enabled in dashboard
- [ ] Test transactions completed successfully
- [ ] Fraud prevention rules configured
- [ ] Webhooks set up and tested
- [ ] SSL certificate active on domain
- [ ] Privacy policy updated
- [ ] Terms & conditions include payment terms
- [ ] Refund policy clearly stated
- [ ] Customer support email active
- [ ] Transaction monitoring alerts set up

### Switch to Live Mode:

1. **Get Live API Keys**:
   - Dashboard → Settings → API Keys
   - Generate Live Keys
   - Replace test keys in `.env.local`

2. **Update Environment Variables**:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx_live
```

3. **Test Live Payment**:
   - Make a small test purchase ($1)
   - Verify payment flows correctly
   - Check dashboard shows transaction
   - Verify subscription created in database
   - Test refund process

---

## Part 11: PayPal Integration Code (if needed)

If Razorpay doesn't support PayPal in your region, here's how to add PayPal separately:

### Install PayPal SDK:
```bash
npm install @paypal/checkout-server-sdk
```

### Create PayPal API Route:
```typescript
// src/app/api/payment/paypal-create-order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import paypal from '@paypal/checkout-server-sdk'

// Configure PayPal
const clientId = process.env.PAYPAL_CLIENT_ID!
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
const environment = new paypal.core.LiveEnvironment(clientId, clientSecret)
const client = new paypal.core.PayPalHttpClient(environment)

export async function POST(request: NextRequest) {
  const { planId, amount } = await request.json()
  
  const requestBody = {
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toString(),
      },
      description: `PetPX ${planId} Plan`,
    }],
  }
  
  const orderRequest = new paypal.orders.OrdersCreateRequest()
  orderRequest.prefer('return=representation')
  orderRequest.requestBody(requestBody)
  
  const order = await client.execute(orderRequest)
  
  return NextResponse.json({
    orderId: order.result.id,
  })
}
```

### Update Checkout Page:
Add PayPal button alongside Razorpay option.

---

## Part 12: Monitoring & Analytics

### Dashboard Metrics to Track:

1. **Payment Success Rate**:
   - Target: >95% for international cards
   - Monitor failed payment reasons

2. **Currency Distribution**:
   - Track which currencies customers use
   - Optimize pricing for popular currencies

3. **Geographic Distribution**:
   - See where customers are from
   - Adjust marketing accordingly

4. **Average Transaction Value**:
   - Monitor which plan is most popular
   - Optimize pricing strategy

---

## Part 13: Customer Support Setup

### Payment-Related Support:

1. **Common Issues**:
   - Card declined → Check with bank
   - 3DS authentication failed → Retry
   - Payment successful but no confirmation → Check spam
   - Duplicate charges → Automatic refund within 7 days

2. **Refund Process**:
   - 7-day money-back guarantee
   - Automated refunds through dashboard
   - Typical refund time: 5-7 business days

3. **Support Channels**:
   - Email: support@petpx.com
   - Live chat (recommended for payment issues)
   - Help documentation

---

## Part 14: Additional Recommendations

### For US/European Customers:

1. **Display Currency Clearly**:
   - Show USD prominently
   - Add currency converter for other regions

2. **Payment Security Badges**:
   - Display "Secured by Razorpay"
   - Show SSL certificate
   - Add trust badges (Norton, McAfee)

3. **Mobile Optimization**:
   - International users often pay via mobile
   - Ensure Razorpay modal works on all devices
   - Test on various browsers (Safari, Chrome, Firefox)

4. **Payment Page Speed**:
   - Optimize checkout page load time
   - Faster checkout = higher conversion

---

## Support Contacts

### Razorpay Support:
- **Email**: support@razorpay.com
- **Phone**: +91-80-6891-8999
- **Website**: https://razorpay.com/support/

### For International Payment Issues:
- **Email**: internationalpayments@razorpay.com
- **Ticket**: Raise from Dashboard → Support

### PayPal Support:
- **Website**: https://www.paypal.com/merchantsupport
- **Phone**: 1-888-221-1161 (US)

---

## Summary

To accept international payments on PetPX:

1. ✅ **Complete Razorpay KYC** (include IEC)
2. ✅ **Enable International Cards** in dashboard
3. ✅ **Configure USD currency**
4. ✅ **Set up fraud prevention**
5. ✅ **Test with international test cards**
6. ✅ **Contact Razorpay for PayPal** (if needed)
7. ✅ **Update code** (already done)
8. ✅ **Go live with proper monitoring**

**Estimated Timeline**: 3-7 days (depending on KYC approval)

**Cost**: 3-4% per international transaction + currency conversion fees

---

Need help with setup? Contact Razorpay support and mention you need international payment acceptance for a SaaS business.
