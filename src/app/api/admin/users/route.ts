import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin API key check
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const adminKey = process.env.ADMIN_API_KEY
  
  if (!adminKey) {
    console.error('ADMIN_API_KEY not configured')
    return false
  }
  
  return authHeader === `Bearer ${adminKey}`
}

/**
 * GET /api/admin/users
 * Fetch user data for admin dashboard with payment, preferences, and download info
 */
export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid admin key' },
      { status: 401 }
    )
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    // Create admin Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString()
    
    // Fetch users with their subscriptions, payments, preferences, and generation data
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        created_at,
        subscriptions (
          id,
          plan_id,
          status,
          images_total,
          created_at
        ),
        payments (
          id,
          plan_id,
          amount,
          currency,
          status,
          payment_method,
          metadata,
          created_at
        ),
        user_preferences (
          preferred_styles,
          preferred_backgrounds,
          preferred_accessories,
          pet_type
        ),
        generated_images (
          id,
          pet_type,
          style,
          background,
          accessories,
          status,
          image_urls,
          created_at
        )
      `)
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: false })
    
    if (usersError) {
      console.error('Error fetching users:', usersError)
      throw usersError
    }
    
    // Track download events
    const { data: downloadEvents } = await supabase
      .from('user_events')
      .select('user_id, metadata')
      .eq('event_type', 'images_downloaded')
      .gte('timestamp', startDateStr)
    
    // Create a map of user downloads
    const userDownloads: Record<string, number> = {}
    downloadEvents?.forEach(event => {
      if (event.user_id) {
        const count = event.metadata?.count || 1
        userDownloads[event.user_id] = (userDownloads[event.user_id] || 0) + count
      }
    })
    
    // Transform data for the table
    const users = (usersData || []).map(user => {
      const subscription = user.subscriptions?.[0]
      const payment = user.payments?.find((p: { status: string }) => p.status === 'paid') || user.payments?.[0]
      const preferences = user.user_preferences?.[0]
      const generations = user.generated_images || []
      
      // Get pet type from preferences or generations
      let petType = preferences?.pet_type || 'unknown'
      if (petType === 'unknown' && generations.length > 0) {
        petType = generations[0].pet_type || 'unknown'
      }
      
      // Get styles from preferences or generations
      let styles: string[] = preferences?.preferred_styles || []
      if (styles.length === 0 && generations.length > 0) {
        styles = [...new Set(generations.map((g: { style: string }) => g.style))]
      }
      
      // Get backgrounds from preferences or generations
      let backgrounds: string[] = preferences?.preferred_backgrounds || []
      if (backgrounds.length === 0 && generations.length > 0) {
        backgrounds = [...new Set(generations.map((g: { background: string }) => g.background))]
      }
      
      // Get accessories from preferences or generations
      let accessories: string[] = preferences?.preferred_accessories || []
      if (accessories.length === 0 && generations.length > 0) {
        const allAccessories = generations.flatMap((g: { accessories: string[] }) => g.accessories || [])
        accessories = [...new Set(allAccessories)]
      }
      
      // Calculate downloaded photos
      const photosDownloaded = userDownloads[user.id] || 0
      
      // Get discount code from payment metadata
      const discountCode = payment?.metadata?.discount_code || null
      
      return {
        id: user.id,
        date: user.created_at,
        email: user.email,
        plan: subscription?.plan_id || payment?.plan_id || 'none',
        paymentMethod: payment?.payment_method || 'N/A',
        amount: payment ? payment.amount / 100 : 0, // Convert from cents
        discountCode,
        styles,
        backgrounds,
        accessories,
        petType,
        photosDownloaded,
      }
    })
    
    // Calculate stats
    const stats = {
      totalUsers: users.length,
      totalRevenue: users.reduce((sum, u) => sum + u.amount, 0),
      totalDownloads: Object.values(userDownloads).reduce((sum, count) => sum + count, 0),
      activeSubscriptions: users.filter(u => u.plan !== 'none').length,
    }
    
    return NextResponse.json({
      users,
      stats,
      period: `Last ${days} days`,
    })
    
  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    )
  }
}
