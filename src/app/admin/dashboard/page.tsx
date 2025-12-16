'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  CreditCard,
  Tag,
  Palette,
  Image as ImageIcon,
  Sparkles,
  PawPrint,
  FileDown,
  RefreshCw
} from 'lucide-react'
import AdminHeader from '@/components/AdminHeader'

interface UserRecord {
  id: string
  date: string
  email: string
  plan: string
  paymentMethod: string
  amount: number
  discountCode: string | null
  styles: string[]
  backgrounds: string[]
  accessories: string[]
  petType: string
  photosDownloaded: number
}

interface Stats {
  totalUsers: number
  totalRevenue: number
  totalDownloads: number
  activeSubscriptions: number
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Data state
  const [users, setUsers] = useState<UserRecord[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<UserRecord[]>([])
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('30')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const fetchData = async (key: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/users?days=${dateRange}`, {
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
        throw new Error('Failed to fetch data')
      }

      const data = await response.json()
      setUsers(data.users || [])
      setStats(data.stats || null)
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
      fetchData(adminKey)
    }
  }

  // Filter users based on search and plan filter
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(term) ||
        user.plan.toLowerCase().includes(term) ||
        user.petType.toLowerCase().includes(term)
      )
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(user => user.plan.toLowerCase() === planFilter)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm, planFilter])

  // Refetch when date range changes
  useEffect(() => {
    if (authenticated && adminKey) {
      fetchData(adminKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange])

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Date',
      'Email',
      'Plan',
      'Payment Method',
      'Amount ($)',
      'Discount Code',
      'Styles',
      'Backgrounds',
      'Accessories',
      'Pet Type',
      'Photos Downloaded'
    ]

    const rows = filteredUsers.map(user => [
      user.date,
      user.email,
      user.plan,
      user.paymentMethod,
      user.amount.toFixed(2),
      user.discountCode || '',
      user.styles.join('; '),
      user.backgrounds.join('; '),
      user.accessories.join('; '),
      user.petType,
      user.photosDownloaded.toString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `petpx-users-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full card-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">PetPX Analytics</p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin API Key
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter your admin key"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      
      {/* Controls Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">User Analytics</h1>
              <button
                onClick={() => fetchData(adminKey)}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search email, plan..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-48"
                />
              </div>
              
              {/* Plan Filter */}
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="ultra">Ultra</option>
              </select>
              
              {/* Date Range */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              
              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            title="Total Users"
            value={stats?.totalUsers || users.length}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            title="Total Revenue"
            value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<Download className="w-5 h-5" />}
            title="Photos Downloaded"
            value={stats?.totalDownloads || 0}
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="Active Subscriptions"
            value={stats?.activeSubscriptions || 0}
            color="yellow"
          />
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">
                User Data ({filteredUsers.length} records)
              </h2>
              <p className="text-sm text-gray-500">
                Showing {paginatedUsers.length} of {filteredUsers.length}
              </p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Date
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Plan</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Payment
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      Amount
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Discount
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Palette className="w-3.5 h-3.5" />
                      Styles
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Backgrounds
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Accessories
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <PawPrint className="w-3.5 h-3.5" />
                      Pet
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      Downloads
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                      No users found matching your filters
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(user.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          user.plan === 'ultra' ? 'bg-purple-100 text-purple-700' :
                          user.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.paymentMethod}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        ${user.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {user.discountCode ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                            {user.discountCode}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {user.styles.slice(0, 2).map((s, i) => (
                            <span key={i} className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs">
                              {s}
                            </span>
                          ))}
                          {user.styles.length > 2 && (
                            <span className="text-gray-400 text-xs">+{user.styles.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {user.backgrounds.slice(0, 2).map((b, i) => (
                            <span key={i} className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-xs">
                              {b}
                            </span>
                          ))}
                          {user.backgrounds.length > 2 && (
                            <span className="text-gray-400 text-xs">+{user.backgrounds.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {user.accessories.length > 0 ? (
                            <>
                              {user.accessories.slice(0, 2).map((a, i) => (
                                <span key={i} className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-xs">
                                  {a}
                                </span>
                              ))}
                              {user.accessories.length > 2 && (
                                <span className="text-gray-400 text-xs">+{user.accessories.length - 2}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 capitalize">
                          {user.petType === 'dog' && '🐕'}
                          {user.petType === 'cat' && '🐈'}
                          {user.petType === 'bird' && '🦜'}
                          {user.petType === 'rabbit' && '🐰'}
                          {user.petType === 'hamster' && '🐹'}
                          {user.petType === 'other' && '🐾'}
                          {user.petType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{user.photosDownloaded}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string | number
  color: 'blue' | 'green' | 'purple' | 'yellow'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl p-5 card-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2.5 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
