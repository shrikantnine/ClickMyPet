import { NextRequest, NextResponse } from 'next/server'
import { 
  getPlatformStats,
  getPopularStyles,
  getPopularBackgrounds,
  getPopularAccessories,
  getGenerationTrends,
  getRevenueTrends,
  getPlanDistribution,
} from '@/lib/analytics'

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
 * GET /api/admin/analytics
 * Fetch comprehensive analytics data for admin dashboard
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
    
    console.log('Fetching analytics data...')
    
    // Fetch all analytics data in parallel with error handling
    const [
      platformStats,
      popularStyles,
      popularBackgrounds,
      popularAccessories,
      generationTrends,
      revenueTrends,
      planDistribution,
    ] = await Promise.all([
      getPlatformStats().catch(err => {
        console.error('Error fetching platform stats:', err)
        return { totalUsers: 0, activeSubscriptions: 0, totalGenerations: 0, totalRevenue: 0, recentGenerations: 0, recentSignups: 0 }
      }),
      getPopularStyles(10).catch(err => {
        console.error('Error fetching popular styles:', err)
        return []
      }),
      getPopularBackgrounds(10).catch(err => {
        console.error('Error fetching popular backgrounds:', err)
        return []
      }),
      getPopularAccessories(10).catch(err => {
        console.error('Error fetching popular accessories:', err)
        return []
      }),
      getGenerationTrends(days).catch(err => {
        console.error('Error fetching generation trends:', err)
        return []
      }),
      getRevenueTrends(days).catch(err => {
        console.error('Error fetching revenue trends:', err)
        return []
      }),
      getPlanDistribution().catch(err => {
        console.error('Error fetching plan distribution:', err)
        return []
      }),
    ])
    
    console.log('Analytics fetched successfully')
    
    return NextResponse.json({
      platformStats,
      popularStyles,
      popularBackgrounds,
      popularAccessories,
      generationTrends,
      revenueTrends,
      planDistribution,
      period: `Last ${days} days`,
      message: platformStats.totalUsers === 0 ? 'No data yet - dashboard will populate when users start using the platform' : null
    })
    
  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
