'use client'

import { useState, useEffect } from 'react'
import { Users, Download, Search, Filter, TrendingUp, Globe, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminHeader from '@/components/AdminHeader'

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

export default function VisitorsAnalytics() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterConverted, setFilterConverted] = useState<string>('all')
  const [filterDevice, setFilterDevice] = useState<string>('all')
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVisitors = async (key: string) => {
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
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      })

      if (response.status === 401) {
        setAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch visitors')
      }

      const data = await response.json()
      setVisitors(data.visitors)
      setStats(data.stats)
      setTotalPages(data.totalPages)
      setAuthenticated(true)
    } catch (err) {
      console.error('Error fetching visitors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey) {
      fetchVisitors(adminKey)
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
        headers: {
          'Authorization': `Bearer ${adminKey}`,
        },
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

  useEffect(() => {
    if (authenticated && adminKey) {
      fetchVisitors(adminKey)
    }
  }, [page, searchTerm, filterConverted, filterDevice])

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-black/90" />
            <h1 className="text-2xl font-bold text-white">Visitor Analytics</h1>
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
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
                placeholder="Enter your admin key"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition"
            >
              Access Analytics
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading visitor data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Visitor Analytics</h2>
            
            <Button
              onClick={handleExportCSV}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

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
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
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
                        <span className="text-black/90">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Top Traffic Sources</h3>
              <div className="space-y-3">
                {stats.topSources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300">{source.source || 'Direct'}</span>
                    <span className="text-black/90 font-semibold">{source.count}</span>
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
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors = {
    purple: 'text-black/90',
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

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
}
