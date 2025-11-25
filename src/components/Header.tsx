'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, SPACING } from '@/lib/utils'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Header visibility logic for mobile
      if (window.innerWidth < 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false) // Hide on scroll down
        } else {
          setIsVisible(true) // Show on scroll up
        }
      } else {
        setIsVisible(true) // Always visible on desktop
      }

      setIsScrolled(currentScrollY > 50)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm transition-all duration-300',
          isVisible ? 'bg-white/80 translate-y-0' : '-translate-y-full',
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}
        style={{ marginBottom: SPACING.SECTION_GAP }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CMP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Click My Pet</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#how-it-works" className="text-gray-800 hover:text-gray-900 transition-colors">
                How it works
              </Link>
              <Link href="/gallery" className="text-gray-800 hover:text-gray-900 transition-colors">
                Gallery
              </Link>
              <Link href="#pricing" className="text-gray-800 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="text-gray-800 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="/try-free">
                <Button variant="default" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <span className="text-lg">✨</span>
                  Try Free Now
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={cn(
            'md:hidden absolute top-full left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 transition-all duration-300',
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          )}
        >
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/try-free" 
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-colors font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-xl">✨</span>
              <span className="font-medium">Try Free Now</span>
            </Link>
            <Link 
              href="#how-it-works" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              How it works
            </Link>
            <Link 
              href="/gallery" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              href="#pricing" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/blog" 
              className="block p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-16" />
    </>
  )
}