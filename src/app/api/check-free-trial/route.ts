import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')
    
    // Get IP address from request
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email or userId required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user has already used free trial by email OR IP
    const { data: trials, error } = await supabase
      .from('user_trials')
      .select('*')
      .or(`email.eq.${email},ip_address.eq.${ip}`)
      .limit(1)

    if (error) {
      console.error('Error checking free trial:', error)
      return NextResponse.json(
        { error: 'Failed to check free trial status' },
        { status: 500 }
      )
    }

    const hasUsedFreeTrial = trials && trials.length > 0
    const isEmailVerified = hasUsedFreeTrial ? trials[0].email_verified : false

    return NextResponse.json({
      hasUsedFreeTrial,
      isEmailVerified,
      trial: trials && trials.length > 0 ? trials[0] : null,
      message: hasUsedFreeTrial 
        ? 'Free trial already used. Please choose a paid plan.' 
        : 'Free trial available'
    })

  } catch (error) {
    console.error('Free trial check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
