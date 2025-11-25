import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, userId, email, ...metadata } = body

    if (!event) {
      return NextResponse.json(
        { error: 'Event type required' },
        { status: 400 }
      )
    }

    // Get IP address from request
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert event into user_events table
    const { data, error } = await supabase
      .from('user_events')
      .insert({
        event_type: event,
        user_id: userId || null,
        email: email || null,
        ip_address: ip,
        metadata: metadata,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Analytics tracking error:', error)
      // Don't fail the request if analytics fails
      return NextResponse.json({ 
        success: false, 
        message: 'Analytics tracking failed but request continued' 
      })
    }

    return NextResponse.json({
      success: true,
      eventId: data.id
    })

  } catch (error) {
    console.error('Analytics error:', error)
    // Don't fail the main request if analytics fails
    return NextResponse.json({ 
      success: false, 
      message: 'Analytics tracking failed' 
    })
  }
}
