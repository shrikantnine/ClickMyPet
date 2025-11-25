'use client'

import { useState, useEffect } from 'react'
import { BarChart, TrendingUp, Users, DollarSign, Image, Package, Palette, Sparkles, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'

interface PlatformStats {
  totalUsers: number
  activeSubscriptions: number
  totalGenerations: number
  totalRevenue: number
  recentGenerations: number
  recentSignups: number
}

interface TrendData {
  date: string
  count?: number
  revenue?: number
}

interface PopularItem {
  style?: string
  background?: string
  accessory?: string
  count: number
}

interface PlanDist {
  plan: string
  count: number
}

interface AnalyticsData {
  platformStats: PlatformStats | null
  popularStyles: PopularItem[]
  popularBackgrounds: PopularItem[]
  popularAccessories: PopularItem[]
  generationTrends: TrendData[]
  revenueTrends: TrendData[]
  planDistribution: PlanDist[]
  period: string
}

export default function AdminDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState(30)
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const fetchAnalytics = async (key: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/analytics?days=${period}`, {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      })

      if (response.status === 401) {
        setAuthenticated(false)
        setError('Invalid admin key')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalyticsData(data)
      setAuthenticated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey) {
      fetchAnalytics(adminKey)
    }
  }

  useEffect(() => {
    if (authenticated && adminKey) {
      fetchAnalytics(adminKey)
    }
  }, [period])

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <BarChart className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin API Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Enter your admin key"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    )
  }

  const stats = analyticsData?.platformStats

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Click My Pet Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/admin/settings"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 flex items-center gap-2 transition"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link
              href="/admin/visitors"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition"
            >
              <Users className="w-4 h-4" />
              <span>Visitors</span>
            </Link>
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle={`${stats?.recentSignups || 0} new in ${analyticsData?.period}`}
            color="blue"
          />
          <MetricCard
            icon={<Package className="w-6 h-6" />}
            title="Active Subscriptions"
            value={stats?.activeSubscriptions || 0}
            subtitle="Currently active"
            color="green"
          />
          <MetricCard
            icon={<Image className="w-6 h-6" />}
            title="Total Generations"
            value={stats?.totalGenerations || 0}
            subtitle={`${stats?.recentGenerations || 0} in ${analyticsData?.period}`}
            color="purple"
          />
          <MetricCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Revenue"
            value={`$${stats?.totalRevenue.toFixed(2) || 0}`}
            subtitle="All time"
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generation Trends */}
          <ChartCard title="Generation Trends" icon={<TrendingUp className="w-5 h-5" />}>
            {analyticsData?.generationTrends && analyticsData.generationTrends.length > 0 ? (
              <div className="space-y-2">
                {analyticsData.generationTrends.slice(-7).map((trend, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{new Date(trend.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min((trend.count || 0) * 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{trend.count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No generation data yet</p>
                <p className="text-xs mt-1">Data will appear once users start generating images</p>
              </div>
            )}
          </ChartCard>

          {/* Revenue Trends */}
          <ChartCard title="Revenue Trends" icon={<DollarSign className="w-5 h-5" />}>
            {analyticsData?.revenueTrends && analyticsData.revenueTrends.length > 0 ? (
              <div className="space-y-2">
                {analyticsData.revenueTrends.slice(-7).map((trend, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{new Date(trend.date).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${Math.min((trend.revenue || 0) * 5, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">${(trend.revenue || 0).toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No revenue data yet</p>
                <p className="text-xs mt-1">Data will appear once users make purchases</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Plan Distribution */}
        <ChartCard title="Plan Distribution" icon={<Package className="w-5 h-5" />}>
          <div className="grid grid-cols-3 gap-4">
            {analyticsData?.planDistribution.map((plan, i) => (
              <div key={i} className="text-center p-4 bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{plan.count}</div>
                <div className="text-sm text-gray-400 capitalize">{plan.plan}</div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Popular Styles */}
        <ChartCard title="Popular Styles" icon={<Palette className="w-5 h-5" />}>
          {analyticsData?.popularStyles && analyticsData.popularStyles.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.popularStyles.slice(0, 6).map((item, i) => (
                <div key={i} className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-xl font-bold text-purple-400">{item.count || 0}</div>
                  <div className="text-sm text-gray-300 capitalize">{item.style?.replace(/-/g, ' ') || 'N/A'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No style data yet</p>
            </div>
          )}
        </ChartCard>

        {/* Popular Backgrounds */}
        <ChartCard title="Popular Backgrounds" icon={<Image className="w-5 h-5" />}>
          {analyticsData?.popularBackgrounds && analyticsData.popularBackgrounds.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.popularBackgrounds.slice(0, 6).map((item, i) => (
                <div key={i} className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">{item.count || 0}</div>
                  <div className="text-sm text-gray-300 capitalize">{item.background?.replace(/-/g, ' ') || 'N/A'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No background data yet</p>
            </div>
          )}
        </ChartCard>

        {/* Popular Accessories */}
        <ChartCard title="Popular Accessories" icon={<Sparkles className="w-5 h-5" />}>
          {analyticsData?.popularAccessories && analyticsData.popularAccessories.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.popularAccessories.slice(0, 6).map((item, i) => (
                <div key={i} className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-xl font-bold text-green-400">{item.count || 0}</div>
                  <div className="text-sm text-gray-300 capitalize">{item.accessory?.replace(/-/g, ' ') || 'N/A'}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No accessory data yet</p>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle: string
  color: 'blue' | 'green' | 'purple' | 'yellow'
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  )
}

// Chart Card Component
function ChartCard({ 
  title, 
  icon, 
  children 
}: { 
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <div className="text-blue-400">{icon}</div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )
}
