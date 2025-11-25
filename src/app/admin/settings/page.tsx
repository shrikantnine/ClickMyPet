'use client'

import { useState, useEffect } from 'react'
import { Settings, Users, BarChart, ArrowLeft, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TrackingStats {
  totalVisitors: number
  last24h: number
  conversionRate: number
  avgTimeOnSite: number
}

export default function AdminSettingsPage() {
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [stats, setStats] = useState<TrackingStats | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingToggleValue, setPendingToggleValue] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchSettings = async (key: string) => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
      })

      if (response.status === 401) {
        setAuthenticated(false)
        setMessage({ type: 'error', text: 'Invalid admin key' })
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      setTrackingEnabled(data.visitorTrackingEnabled)
      setAuthenticated(true)

      // Fetch stats if tracking is enabled
      if (data.visitorTrackingEnabled) {
        await fetchStats(key)
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async (key: string) => {
    try {
      const response = await fetch('/api/admin/visitors?limit=1', {
        headers: {
          'Authorization': `Bearer ${key}`,
        },
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
        await fetchStats(adminKey)
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey) {
      fetchSettings(adminKey)
    }
  }

  useEffect(() => {
    if (authenticated && adminKey) {
      const interval = setInterval(() => {
        if (trackingEnabled) {
          fetchStats(adminKey)
        }
      }, 30000) // Refresh stats every 30 seconds

      return () => clearInterval(interval)
    }
  }, [authenticated, adminKey, trackingEnabled])

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
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
            
            {message && message.type === 'error' && (
              <div className="text-red-400 text-sm">{message.text}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
            >
              Access Settings
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">Admin Settings</h1>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/dashboard">
                <Button variant="outline">
                  <BarChart className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/visitors">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Visitors
                </Button>
              </Link>
            </div>
          </div>
          
          {message && (
            <div className={`px-4 py-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
                    <li>• Data deletion available upon request (right to be forgotten)</li>
                    <li>• Privacy policy updated with tracking disclosure</li>
                    <li>• Sensitive data (passwords, tokens) automatically filtered</li>
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
                    <li><strong className="text-yellow-300">Enabled:</strong> Collect rich data for retargeting, email campaigns, and behavioral analysis</li>
                    <li><strong className="text-yellow-300">Disabled:</strong> Lighter page load, no cookie banner, potentially higher initial conversion</li>
                  </ul>
                  <p className="text-gray-400 mt-2">
                    💡 <strong>Recommendation:</strong> Run for 1-2 weeks enabled, then 1-2 weeks disabled to compare conversion rates and long-term ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/visitors">
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={!trackingEnabled}>
                <Users className="w-4 h-4 mr-2" />
                View Visitor Analytics
              </Button>
            </Link>
            <Link href="/privacy-policy">
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                View Privacy Policy
              </Button>
            </Link>
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
                  <br/><br/>
                  <strong className="text-green-400">Benefits:</strong> Rich behavioral data, retargeting capabilities, 
                  campaign attribution, email list growth.
                </>
              ) : (
                <>
                  This will immediately stop all visitor tracking. The cookie consent banner will be hidden, 
                  and no new visitor data will be collected.
                  <br/><br/>
                  <strong className="text-yellow-400">Impact:</strong> You'll lose insights into traffic sources, 
                  user behavior, and retargeting capabilities. Existing data will be preserved.
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
