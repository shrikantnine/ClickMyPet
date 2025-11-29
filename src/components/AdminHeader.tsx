'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart, Users, ShoppingCart, Settings as SettingsIcon, LogOut } from 'lucide-react'

export default function AdminHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">PetPX Admin</h1>
        </div>
        
        <nav className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Link
            href="/admin/dashboard"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              isActive('/admin/dashboard') 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            href="/admin/visitors"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              isActive('/admin/visitors') 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Visitors</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              isActive('/admin/orders') 
                ? 'bg-green-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders</span>
          </Link>
          
          <Link
            href="/admin/settings"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition whitespace-nowrap ${
              isActive('/admin/settings') 
                ? 'bg-gray-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
