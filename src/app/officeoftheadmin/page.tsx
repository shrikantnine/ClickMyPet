'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, TrendingUp, Users, DollarSign, Image, Package, 
  Palette, Sparkles, Settings, Shield, AlertTriangle, CheckCircle,
  Download, Search, Filter, Globe, MousePointer, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ============================================
// TYPES & INTERFACES
// ============================================

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

interface Visitor {
  id: string
  visitor_id: string
  email: string | null
  device_type: string
  browser_name: string
  os_name: string
  country: string | null
  utm_source: string | null
  utm_campaign: string | null
  landing_page: string
  page_views: number
  time_on_site: number
  converted: boolean
  conversion_type: string | null
  first_visit: string
  last_visit: string
}

interface VisitorStats {
  totalVisitors: number
  uniqueVisitors24h: number
  avgTimeOnSite: number
  conversionRate: number
  topSources: { source: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
}

interface TrackingStats {
  totalVisitors: number
  last24h: number
  conversionRate: number
  avgTimeOnSite: number
}

type TabType = 'dashboard' | 'visitors' | 'settings'

// ============================================
// MAIN COMPONENT
// ============================================

export default function OfficeOfTheAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey) {
      // Verify admin key by making a test request
      fetch('/api/admin/analytics?days=30', {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })
        .then(response => {
          if (response.status === 401) {
            setError('Invalid admin key')
            setAuthenticated(false)
          } else if (response.ok) {
            setAuthenticated(true)
            setError(null)
          } else {
            setError('Authentication failed')
          }
        })
        .catch(() => {
          setError('Network error')
        })
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Office of the Admin</h1>
          </div>
          
          <p className="text-gray-400 mb-6">
            Unified admin portal for Click My Pet. Enter your admin key to access dashboard, 
            visitor analytics, and system settings.
          </p>
          
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
              <div className="text-red-400 text-sm bg-red-900/30 border border-red-500/50 rounded p-3">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              Access Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Protected by ADMIN_SECRET_KEY environment variable
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold">Office of the Admin</h1>
                <p className="text-sm text-gray-400">Unified Control Center for Click My Pet</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setAuthenticated(false)
                setAdminKey('')
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <BarChart className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('visitors')}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'visitors'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Users className="w-4 h-4" />
              Visitors
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'dashboard' && <DashboardTab adminKey={adminKey} />}
        {activeTab === 'visitors' && <VisitorsTab adminKey={adminKey} />}
        {activeTab === 'settings' && <SettingsTab adminKey={adminKey} />}
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD TAB
// ============================================

function DashboardTab({ adminKey }: { adminKey: string }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?days=${period}`, {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    )
  }

  const stats = analyticsData?.platformStats

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

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
          value={`$${stats?.totalRevenue?.toFixed(2) || 0}`}
          subtitle="All time"
          color="yellow"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Recent Generations"
          value={stats?.recentGenerations || 0}
          subtitle={`In ${analyticsData?.period}`}
          color="pink"
        />
        <MetricCard
          icon={<Sparkles className="w-6 h-6" />}
          title="New Signups"
          value={stats?.recentSignups || 0}
          subtitle={`In ${analyticsData?.period}`}
          color="indigo"
        />
      </div>

      {/* Popular Choices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PopularList
          title="Popular Styles"
          icon={<Palette className="w-5 h-5" />}
          items={analyticsData?.popularStyles || []}
          color="purple"
        />
        <PopularList
          title="Popular Backgrounds"
          icon={<Image className="w-5 h-5" />}
          items={analyticsData?.popularBackgrounds || []}
          color="blue"
        />
        <PopularList
          title="Popular Accessories"
          icon={<Sparkles className="w-5 h-5" />}
          items={analyticsData?.popularAccessories || []}
          color="pink"
        />
      </div>

      {/* Plan Distribution */}
      {analyticsData?.planDistribution && analyticsData.planDistribution.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {analyticsData.planDistribution.map((plan, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-300 capitalize">{plan.plan}</span>
                <span className="text-blue-400 font-semibold">{plan.count} users</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// VISITORS TAB
// ============================================

function VisitorsTab({ adminKey }: { adminKey: string }) {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterConverted, setFilterConverted] = useState<string>('all')
  const [filterDevice, setFilterDevice] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchVisitors()
  }, [page, searchTerm, filterConverted, filterDevice])

  const fetchVisitors = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        search: searchTerm,
        converted: filterConverted,
        device: filterDevice,
      })

      const response = await fetch(`/api/admin/visitors?${params}`, {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })

      if (response.ok) {
        const data = await response.json()
        setVisitors(data.visitors)
        setStats(data.stats)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      console.error('Error fetching visitors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        converted: filterConverted,
        device: filterDevice,
      })

      const response = await fetch(`/api/admin/export-visitors?${params}`, {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `visitors_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to export data')
    }
  }

  if (loading && visitors.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading visitor data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Visitors"
            value={stats.totalVisitors.toLocaleString()}
            icon={<Users className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            title="Last 24 Hours"
            value={stats.uniqueVisitors24h.toLocaleString()}
            icon={<TrendingUp className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Avg Time on Site"
            value={formatTime(stats.avgTimeOnSite)}
            icon={<MousePointer className="w-5 h-5" />}
            color="green"
          />
          <StatCard
            title="Conversion Rate"
            value={`${(stats.conversionRate * 100).toFixed(1)}%`}
            icon={<Globe className="w-5 h-5" />}
            color="pink"
          />
        </div>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, visitor ID, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          
          <select
            value={filterConverted}
            onChange={(e) => setFilterConverted(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Visitors</option>
            <option value="true">Converted Only</option>
            <option value="false">Not Converted</option>
          </select>
          
          <select
            value={filterDevice}
            onChange={(e) => setFilterDevice(e.target.value)}
            className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Devices</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Visitors Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Visitor ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Device</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Source</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Views</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Converted</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">First Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className="hover:bg-gray-750">
                  <td className="px-4 py-3 text-sm font-mono">{visitor.visitor_id.substring(0, 20)}...</td>
                  <td className="px-4 py-3 text-sm">{visitor.email || <span className="text-gray-500">Anonymous</span>}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{visitor.device_type}</span>
                      <span className="text-gray-500 text-xs">
                        {visitor.browser_name} · {visitor.os_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {visitor.utm_source || visitor.utm_campaign ? (
                      <span className="text-purple-400">
                        {visitor.utm_source || 'Direct'} {visitor.utm_campaign && `(${visitor.utm_campaign})`}
                      </span>
                    ) : (
                      <span className="text-gray-500">Direct</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{visitor.page_views}</td>
                  <td className="px-4 py-3 text-sm">{formatTime(visitor.time_on_site)}</td>
                  <td className="px-4 py-3 text-sm">
                    {visitor.converted ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                        ✓ {visitor.conversion_type}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {new Date(visitor.first_visit).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-600">
          <div className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              className="text-sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              className="text-sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Top Sources & Device Breakdown */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Top Traffic Sources</h3>
            <div className="space-y-3">
              {stats.topSources.map((source, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-300">{source.source || 'Direct'}</span>
                  <span className="text-purple-400 font-semibold">{source.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {stats.deviceBreakdown.map((device, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{device.device}</span>
                  <span className="text-blue-400 font-semibold">{device.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SETTINGS TAB
// ============================================

function SettingsTab({ adminKey }: { adminKey: string }) {
  const [loading, setLoading] = useState(true)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [stats, setStats] = useState<TrackingStats | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingToggleValue, setPendingToggleValue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })

      if (response.ok) {
        const data = await response.json()
        setTrackingEnabled(data.visitorTrackingEnabled)

        // Fetch stats if tracking is enabled
        if (data.visitorTrackingEnabled) {
          await fetchStats()
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/visitors?limit=1', {
        headers: { 'Authorization': `Bearer ${adminKey}` }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.stats) {
          setStats({
            totalVisitors: data.stats.totalVisitors,
            last24h: data.stats.uniqueVisitors24h,
            conversionRate: data.stats.conversionRate,
            avgTimeOnSite: data.stats.avgTimeOnSite,
          })
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleToggleClick = (newValue: boolean) => {
    setPendingToggleValue(newValue)
    setShowConfirmDialog(true)
  }

  const handleConfirmToggle = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorTrackingEnabled: pendingToggleValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      const data = await response.json()
      setTrackingEnabled(data.visitorTrackingEnabled)
      setShowConfirmDialog(false)
      setMessage({
        type: 'success',
        text: `Visitor tracking ${data.visitorTrackingEnabled ? 'enabled' : 'disabled'} successfully`,
      })

      // Refresh stats
      if (data.visitorTrackingEnabled) {
        await fetchStats()
      } else {
        setStats(null)
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update settings',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`px-4 py-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Visitor Tracking Control */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold">Visitor Tracking System</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Control the global visitor tracking system. When enabled, all website visitors will be tracked 
              (cookies, browsing behavior, UTM parameters, device info, etc.) for marketing analytics and retargeting.
            </p>
          </div>
          
          <button
            onClick={() => handleToggleClick(!trackingEnabled)}
            disabled={saving}
            className={`relative inline-flex h-12 w-24 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              trackingEnabled ? 'bg-purple-600' : 'bg-gray-600'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-11 w-11 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                trackingEnabled ? 'translate-x-12' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className={`space-y-4 ${trackingEnabled ? 'opacity-100' : 'opacity-50'}`}>
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              trackingEnabled 
                ? 'bg-green-900/50 text-green-300' 
                : 'bg-red-900/50 text-red-300'
            }`}>
              {trackingEnabled ? (
                <>
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Active & Collecting Data
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Disabled - Not Collecting Data
                </>
              )}
            </div>
          </div>

          {/* Live Stats */}
          {trackingEnabled && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Total Visitors</div>
                <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Last 24 Hours</div>
                <div className="text-2xl font-bold text-blue-400">{stats.last24h.toLocaleString()}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold text-green-400">
                  {(stats.conversionRate * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Avg Time on Site</div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.floor(stats.avgTimeOnSite / 60)}m {stats.avgTimeOnSite % 60}s
                </div>
              </div>
            </div>
          )}

          {/* What Gets Tracked */}
          <div className="bg-gray-700/50 rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-3 text-gray-200">📊 Data Collection Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <div className="font-medium text-gray-300">Device & Browser Info</div>
                  <div className="text-gray-500">OS, browser, screen resolution, fingerprint</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <div className="font-medium text-gray-300">Cookies & Storage</div>
                  <div className="text-gray-500">Cookies, localStorage, sessionStorage</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <div className="font-medium text-gray-300">Traffic Sources</div>
                  <div className="text-gray-500">Referrer, UTM parameters, landing page</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <div>
                  <div className="font-medium text-gray-300">Behavioral Data</div>
                  <div className="text-gray-500">Page views, time on site, scroll depth, clicks</div>
                </div>
              </div>
            </div>
          </div>

          {/* GDPR Compliance Info */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-semibold text-blue-300 mb-1">GDPR Compliance Active</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Cookie consent banner shown to all visitors</li>
                  <li>• Users can opt-out via "Decline" button</li>
                  <li>• Data deletion available upon request</li>
                  <li>• Privacy policy updated with tracking disclosure</li>
                  <li>• Sensitive data automatically filtered</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-semibold text-yellow-300 mb-1">A/B Testing Impact Analysis</h4>
                <p className="text-gray-400 mb-2">
                  Use this toggle to test the impact of visitor tracking on conversions:
                </p>
                <ul className="text-gray-400 space-y-1">
                  <li><strong className="text-yellow-300">Enabled:</strong> Collect rich data for retargeting and behavioral analysis</li>
                  <li><strong className="text-yellow-300">Disabled:</strong> Lighter page load, no cookie banner, potentially higher initial conversion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-3">
              {pendingToggleValue ? 'Enable' : 'Disable'} Visitor Tracking?
            </h3>
            <p className="text-gray-400 mb-6">
              {pendingToggleValue ? (
                <>
                  This will activate visitor tracking system-wide. All visitors will see the cookie consent 
                  banner, and those who accept will be tracked for marketing analytics.
                </>
              ) : (
                <>
                  This will immediately stop all visitor tracking. The cookie consent banner will be hidden, 
                  and no new visitor data will be collected.
                </>
              )}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmToggle}
                className={`flex-1 ${
                  pendingToggleValue 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// HELPER COMPONENTS
// ============================================

function MetricCard({ icon, title, value, subtitle, color }: { 
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle: string
  color: string
}) {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className={colors[color as keyof typeof colors]}>{icon}</span>
      </div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { 
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  const colors = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    pink: 'text-pink-400',
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <span className={colors[color as keyof typeof colors]}>{icon}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

function PopularList({ title, icon, items, color }: {
  title: string
  icon: React.ReactNode
  items: PopularItem[]
  color: string
}) {
  const colors = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400',
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className={colors[color as keyof typeof colors]}>{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.slice(0, 5).map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm text-gray-300 capitalize">
              {item.style || item.background || item.accessory}
            </span>
            <span className={`text-sm font-semibold ${colors[color as keyof typeof colors]}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}
