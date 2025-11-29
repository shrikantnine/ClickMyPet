// API Route: Create Razorpay Order
// POST /api/payment/create-order

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createRazorpayOrder } from '@/lib/razorpay'
import { getPlanById } from '@/lib/pricing'

import { trackUserActivity } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Payment system configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const { planId, preferences } = await request.json()

    // Validate plan
    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login first.' },
        { status: 401 }
      )
    }

    // Create payment record in database
    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount: plan.price * 100, // Convert to cents
        currency: 'USD',
        status: 'created',
        razorpay_order_id: `temp_${Date.now()}`, // Temporary, will be updated
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      )
    }

    // Create Razorpay order
    const orderResult = await createRazorpayOrder({
      amount: plan.price * 100, // Convert to cents
      currency: 'USD',
      receipt: payment.id,
      notes: {
        userId: user.id,
        planId: planId,
        planName: plan.name,
        ...preferences // Include style/breed preferences in Razorpay dashboard
      },
    })

    if (!orderResult.success || !orderResult.order) {
      // Clean up payment record
      await supabase.from('payments').delete().eq('id', payment.id)

      return NextResponse.json(
        { error: 'Failed to create payment order' },
        { status: 500 }
      )
    }

    // Track checkout initiation with preferences
    await trackUserActivity({
      userId: user.id,
      action: 'checkout_initiated',
      metadata: {
        planId,
        amount: plan.price,
        ...preferences
      }
    })

    // Update payment record with actual Razorpay order ID
    await supabase
      .from('payments')
      .update({
        razorpay_order_id: orderResult.order.id,
      })
      .eq('id', payment.id)

    return NextResponse.json({
      success: true,
      orderId: orderResult.order.id,
      amount: plan.price * 100,
      currency: 'USD',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      planName: plan.name,
      userEmail: user.email,
      userName: user.user_metadata?.name || '',
    })
  } catch (error) {
    console.error('Error in create-order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
