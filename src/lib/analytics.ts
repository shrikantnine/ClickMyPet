// Analytics tracking for user activity and product insights
import { createClient } from '@supabase/supabase-js'
import type { UserSelections } from './ai-prompt-builder'

// Server-side Supabase client for analytics
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side
  
  return createClient(supabaseUrl, supabaseKey)
}

export interface ImageGenerationEvent {
  userId: string
  planId: string
  selections: UserSelections
  numImages: number
  estimatedTime: number
}

export interface UserActivityEvent {
  userId: string
  action: string
  metadata?: Record<string, any>
}

/**
 * Track image generation event for analytics
 */
export async function trackImageGeneration(event: ImageGenerationEvent) {
  const supabase = getSupabaseClient()
  
  try {
    // Track the generation event
    await supabase.from('analytics_generations').insert({
      user_id: event.userId,
      plan_id: event.planId,
      pet_type: event.selections.petType,
      pet_breed: event.selections.petBreed,
      style: event.selections.style,
      background: event.selections.background,
      accessories: event.selections.accessories || [],
      num_images: event.numImages,
      estimated_time: event.estimatedTime,
      timestamp: new Date().toISOString(),
    })
    
    // Update aggregated style stats
    await supabase.rpc('increment_style_count', {
      p_style: event.selections.style,
    })
    
    // Update aggregated background stats
    await supabase.rpc('increment_background_count', {
      p_background: event.selections.background,
    })
    
    // Track accessories if any
    if (event.selections.accessories && event.selections.accessories.length > 0) {
      for (const accessory of event.selections.accessories) {
        await supabase.rpc('increment_accessory_count', {
          p_accessory: accessory,
        })
      }
    }
    
  } catch (error) {
    console.error('Failed to track generation:', error)
    // Don't throw - analytics should not break the main flow
  }
}

/**
 * Track user activity event
 */
export async function trackUserActivity(event: UserActivityEvent) {
  const supabase = getSupabaseClient()
  
  try {
    await supabase.from('analytics_user_activity').insert({
      user_id: event.userId,
      action: event.action,
      metadata: event.metadata || {},
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to track user activity:', error)
  }
}

/**
 * Track page view
 */
export async function trackPageView(userId: string | null, page: string) {
  const supabase = getSupabaseClient()
  
  try {
    await supabase.from('analytics_page_views').insert({
      user_id: userId,
      page,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

/**
 * Track subscription event
 */
export async function trackSubscription(
  userId: string,
  action: 'created' | 'upgraded' | 'cancelled' | 'expired',
  planId: string,
  metadata?: Record<string, any>
) {
  const supabase = getSupabaseClient()
  
  try {
    await supabase.from('analytics_subscriptions').insert({
      user_id: userId,
      action,
      plan_id: planId,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to track subscription:', error)
  }
}

/**
 * Get popular styles (for admin dashboard)
 */
export async function getPopularStyles(limit: number = 10) {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('analytics_style_stats')
      .select('*')
      .order('count', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Failed to get popular styles:', error)
      return [
        { style: 'professional-portrait', count: 0 },
        { style: 'watercolor-art', count: 0 },
        { style: 'vintage-film', count: 0 },
      ]
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getPopularStyles:', error)
    return []
  }
}

/**
 * Get popular backgrounds (for admin dashboard)
 */
export async function getPopularBackgrounds(limit: number = 10) {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('analytics_background_stats')
      .select('*')
      .order('count', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Failed to get popular backgrounds:', error)
      return [
        { background: 'studio-white', count: 0 },
        { background: 'nature-garden', count: 0 },
        { background: 'beach-sunset', count: 0 },
      ]
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getPopularBackgrounds:', error)
    return []
  }
}

/**
 * Get popular accessories (for admin dashboard)
 */
export async function getPopularAccessories(limit: number = 10) {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('analytics_accessory_stats')
      .select('*')
      .order('count', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Failed to get popular accessories:', error)
      return [
        { accessory: 'bow-tie', count: 0 },
        { accessory: 'sunglasses', count: 0 },
        { accessory: 'crown', count: 0 },
      ]
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getPopularAccessories:', error)
    return []
  }
}

/**
 * Get user generation statistics
 */
export async function getUserStats(userId: string) {
  const supabase = getSupabaseClient()
  
  const { data, error } = await supabase
    .from('analytics_generations')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
  
  if (error) {
    console.error('Failed to get user stats:', error)
    return null
  }
  
  return {
    totalGenerations: data.length,
    totalImages: data.reduce((sum, gen) => sum + gen.num_images, 0),
    favoriteStyle: getMostCommon(data.map(d => d.style)),
    favoriteBackground: getMostCommon(data.map(d => d.background)),
    generations: data,
  }
}

/**
 * Get overall platform statistics (for admin dashboard)
 */
export async function getPlatformStats() {
  const supabase = getSupabaseClient()
  
  try {
    // Total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    // Total generations
    const { count: totalGenerations } = await supabase
      .from('generated_images')
      .select('*', { count: 'exact', head: true })
    
    // Total revenue (sum of successful payments)
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'paid')
    
    const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: recentGenerations } = await supabase
      .from('analytics_generations')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', sevenDaysAgo.toISOString())
    
    const { count: recentSignups } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())
    
    return {
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0,
      totalGenerations: totalGenerations || 0,
      totalRevenue: totalRevenue / 100, // Convert from cents to dollars
      recentGenerations: recentGenerations || 0,
      recentSignups: recentSignups || 0,
    }
  } catch (error) {
    console.error('Failed to get platform stats:', error)
    return {
      totalUsers: 0,
      activeSubscriptions: 0,
      totalGenerations: 0,
      totalRevenue: 0,
      recentGenerations: 0,
      recentSignups: 0,
    }
  }
}

/**
 * Get generation trends over time (for admin dashboard)
 */
export async function getGenerationTrends(days: number = 30) {
  try {
    const supabase = getSupabaseClient()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('analytics_generations')
      .select('timestamp, num_images')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true })
    
    if (error || !data || data.length === 0) {
      if (error) console.error('Failed to get generation trends:', error)
      // Return last 7 days with zero values
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toISOString().split('T')[0],
          count: 0
        }
      })
    }
    
    // Group by date
    const trendsByDate: Record<string, number> = {}
    
    data.forEach(gen => {
      const date = new Date(gen.timestamp).toISOString().split('T')[0]
      trendsByDate[date] = (trendsByDate[date] || 0) + gen.num_images
    })
    
    return Object.entries(trendsByDate).map(([date, count]) => ({
      date,
      count,
    }))
  } catch (error) {
    console.error('Error in getGenerationTrends:', error)
    return []
  }
}

/**
 * Get revenue trends over time (for admin dashboard)
 */
export async function getRevenueTrends(days: number = 30) {
  try {
    const supabase = getSupabaseClient()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount')
      .eq('status', 'paid')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error || !data || data.length === 0) {
      if (error) console.error('Failed to get revenue trends:', error)
      // Return last 7 days with zero values
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toISOString().split('T')[0],
          revenue: 0
        }
      })
    }
    
    // Group by date
    const revenueByDate: Record<string, number> = {}
    
    data.forEach(payment => {
      const date = new Date(payment.created_at).toISOString().split('T')[0]
      revenueByDate[date] = (revenueByDate[date] || 0) + payment.amount
    })
    
    return Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      revenue: amount / 100, // Convert from cents to dollars
    }))
  } catch (error) {
    console.error('Error in getRevenueTrends:', error)
    return []
  }
}

/**
 * Get plan distribution (for admin dashboard)
 */
export async function getPlanDistribution() {
  try {
    const supabase = getSupabaseClient()
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('status', 'active')
    
    if (error || !data || data.length === 0) {
      if (error) console.error('Failed to get plan distribution:', error)
      return [
        { plan: 'starter', count: 0 },
        { plan: 'pro', count: 0 },
        { plan: 'max', count: 0 },
      ]
    }
    
    const distribution: Record<string, number> = {
      starter: 0,
      pro: 0,
      max: 0
    }
    
    data.forEach(sub => {
      distribution[sub.plan_id] = (distribution[sub.plan_id] || 0) + 1
    })
    
    return Object.entries(distribution).map(([plan, count]) => ({
      plan,
      count,
    }))
  } catch (error) {
    console.error('Error in getPlanDistribution:', error)
    return [
      { plan: 'starter', count: 0 },
      { plan: 'pro', count: 0 },
      { plan: 'max', count: 0 },
    ]
  }
}

// Helper function to get most common value in array
function getMostCommon(arr: string[]): string | null {
  if (arr.length === 0) return null
  
  const frequency: Record<string, number> = {}
  
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1
  })
  
  return Object.entries(frequency).reduce((a, b) => 
    b[1] > a[1] ? b : a
  )[0]
}
