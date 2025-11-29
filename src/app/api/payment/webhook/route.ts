// API Route: Razorpay Webhook Handler
// POST /api/payment/webhook
// This handles payment events from Razorpay (payment captured, failed, etc.)

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getPlanById, type PricingPlan } from '@/lib/pricing'
import { mergePlanMetadata } from '@/lib/subscription-orchestrator'
import { trackSubscription } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    console.log('Razorpay webhook event:', event.event)

    // Initialize Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin access
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Handle different webhook events
    switch (event.event) {
      case 'payment.authorized':
      case 'payment.captured':
        await handlePaymentSuccess(supabase, event.payload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailed(supabase, event.payload.payment.entity)
        break

      case 'refund.created':
        await handleRefund(supabase, event.payload.refund.entity)
        break

      case 'refund.processed':
        await handleRefundProcessed(supabase, event.payload.refund.entity)
        break

      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(supabase: any, payment: any) {
  try {
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', payment.order_id)
      .single()

    if (fetchError || !paymentRecord) {
      console.error('Payment record not found for webhook:', fetchError)
      return
    }

    const plan = getPlanById(paymentRecord.plan_id)
    if (!plan) {
      console.error('Plan referenced in payment is invalid:', paymentRecord.plan_id)
      return
    }

    const metadataWithPlan = mergePlanMetadata(paymentRecord.metadata, plan)
    const enrichedMetadata = {
      ...metadataWithPlan,
      razorpayPayment: payment,
      lastWebhookSyncAt: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: 'paid',
        razorpay_payment_id: payment.id,
        payment_method: payment.method,
        metadata: enrichedMetadata,
      })
      .eq('id', paymentRecord.id)

    if (updateError) {
      console.error('Error updating payment via webhook:', updateError)
      return
    }

    if (!enrichedMetadata.subscriptionId) {
      const subscriptionId = await createSubscriptionForPayment(supabase, paymentRecord, plan)

      if (subscriptionId) {
        enrichedMetadata.subscriptionId = subscriptionId
        enrichedMetadata.subscriptionSource = 'webhook'
        enrichedMetadata.lastSubscriptionSync = new Date().toISOString()

        const { error: metadataError } = await supabase
          .from('payments')
          .update({ metadata: enrichedMetadata })
          .eq('id', paymentRecord.id)

        if (metadataError) {
          console.error('Failed to persist subscription metadata from webhook:', metadataError)
        }

        await trackSubscription(paymentRecord.user_id, 'created', plan.id, {
          source: 'webhook-recovery',
          paymentId: paymentRecord.id,
        })
      }
    }

    console.log('Payment marked as paid via webhook:', payment.id)
  } catch (error) {
    console.error('Error in handlePaymentSuccess:', error)
  }
}

async function handlePaymentFailed(supabase: any, payment: any) {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        razorpay_payment_id: payment.id,
        metadata: payment,
      })
      .eq('razorpay_order_id', payment.order_id)

    if (error) {
      console.error('Error updating payment:', error)
    } else {
      console.log('Payment marked as failed:', payment.id)
    }
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error)
  }
}

async function handleRefund(supabase: any, refund: any) {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        refund_amount: refund.amount,
        refund_status: 'processing',
      })
      .eq('razorpay_payment_id', refund.payment_id)

    if (error) {
      console.error('Error updating refund:', error)
    } else {
      console.log('Refund initiated:', refund.id)
    }
  } catch (error) {
    console.error('Error in handleRefund:', error)
  }
}

async function handleRefundProcessed(supabase: any, refund: any) {
  try {
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refund_status: 'completed',
      })
      .eq('razorpay_payment_id', refund.payment_id)

    if (error) {
      console.error('Error updating refund:', error)
    } else {
      console.log('Refund processed:', refund.id)

      // Also update subscription status
      const { data: payment } = await supabase
        .from('payments')
        .select('user_id, plan_id')
        .eq('razorpay_payment_id', refund.payment_id)
        .single()

      if (payment) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', payment.user_id)
          .eq('plan_id', payment.plan_id)
          .eq('status', 'active')
      }
    }
  } catch (error) {
    console.error('Error in handleRefundProcessed:', error)
  }
}

async function createSubscriptionForPayment(
  supabase: any,
  paymentRecord: any,
  plan: PricingPlan
) {
  try {
    const { data: subscriptionId, error } = await supabase
      .rpc('create_subscription_from_payment', {
        p_user_id: paymentRecord.user_id,
        p_payment_id: paymentRecord.id,
        p_plan_id: plan.id,
        p_images_total: plan.imageCount,
        p_style_options: plan.styleOptions,
        p_background_options: plan.backgroundOptions,
        p_resolution: plan.resolution,
        p_has_accessories: plan.accessories,
        p_has_custom_requests: plan.customStyleRequests,
        p_has_commercial_rights: plan.commercialRights,
        p_has_priority_support: plan.prioritySupport,
      })

    if (error) {
      console.error('Failed to create subscription from webhook:', error)
      return null
    }

    return subscriptionId
  } catch (error) {
    console.error('Unexpected error creating subscription from webhook:', error)
    return null
  }
}
