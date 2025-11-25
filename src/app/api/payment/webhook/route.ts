// API Route: Razorpay Webhook Handler
// POST /api/payment/webhook
// This handles payment events from Razorpay (payment captured, failed, etc.)

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'paid',
        razorpay_payment_id: payment.id,
        payment_method: payment.method,
        metadata: payment,
      })
      .eq('razorpay_order_id', payment.order_id)

    if (error) {
      console.error('Error updating payment:', error)
    } else {
      console.log('Payment marked as paid:', payment.id)
    }
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
