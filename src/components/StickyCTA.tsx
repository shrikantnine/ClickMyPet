'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StickyCtaProps {
  alwaysVisible?: boolean
}

export default function StickyCTA({ alwaysVisible = false }: StickyCtaProps = {}) {
  const [isVisible, setIsVisible] = useState(alwaysVisible)

  useEffect(() => {
    if (alwaysVisible) {
      setIsVisible(true)
      return
    }

    const handleScroll = () => {
      const howItWorksSection = document.querySelector('#how-it-works')
      const footer = document.querySelector('#footer')
      
      if (howItWorksSection && footer) {
        const howItWorksTop = howItWorksSection.getBoundingClientRect().top
        const footerTop = footer.getBoundingClientRect().top
        
        // Show when "How It Works" section comes into view (with 100px offset) and before footer
        setIsVisible(howItWorksTop <= window.innerHeight - 100 && footerTop > window.innerHeight)
      }
    }

    // Check on initial load
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [alwaysVisible])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 bg-white border-t border-gray-200 shadow-lg',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            <div className="flex">
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
            </div>
            <span className="text-xs text-gray-800 hidden sm:inline">
              4.8/5 (1,249+) reviews
            </span>
            <span className="text-xs text-gray-800 sm:hidden">
              4.8/5 (1,249+)
            </span>
          </div>

          {/* CTA Button */}
          <Link href="/try-free">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm px-6">
              ✨ Try FREE Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}