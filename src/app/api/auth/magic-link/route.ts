import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get IP for tracking
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check if email or IP already used free trial
    const { data: existingTrials } = await supabase
      .from('user_trials')
      .select('*')
      .or(`email.eq.${email},ip_address.eq.${ip}`)
      .limit(1)

    if (existingTrials && existingTrials.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Free trial already used from this email or device',
        hasUsedFreeTrial: true
      }, { status: 403 })
    }

    // Send magic link using Supabase Auth
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/try-free?verified=true`,
      }
    })

    if (error) {
      console.error('Magic link error:', error)
      return NextResponse.json(
        { error: 'Failed to send magic link: ' + error.message },
        { status: 500 }
      )
    }

    // Track signup attempt
    await supabase.from('user_events').insert({
      event_type: 'magic_link_sent',
      email: email,
      ip_address: ip,
      metadata: { timestamp: new Date().toISOString() }
    })

    return NextResponse.json({
      success: true,
      message: `Magic link sent to ${email}. Check your inbox!`,
      email: email
    })

  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
