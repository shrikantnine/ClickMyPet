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

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid admin key' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    
    const offset = (page - 1) * limit

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Build query
    let query = supabase
      .from('payments')
      .select(`
        *,
        users (
          email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      // Search by order ID or user email (requires separate logic or join filter)
      // Supabase doesn't support deep filtering on joined tables easily in one go for search
      // So we'll search on payment fields first
      query = query.or(`razorpay_order_id.ilike.%${search}%,id.eq.${search}`)
    }

    const { data, error, count } = await query

    if (error) throw error

    // Transform data to flatten user email
    const orders = data.map((order: any) => ({
      ...order,
      user_email: order.users?.email || 'Unknown'
    }))

    // Get stats
    const { data: statsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')

    const totalRevenue = statsData?.reduce((sum, p) => sum + p.amount, 0) || 0
    const totalOrders = count || 0

    return NextResponse.json({
      orders,
      totalPages: Math.ceil((count || 0) / limit),
      stats: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      }
    })

  } catch (error) {
    console.error('Admin orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
