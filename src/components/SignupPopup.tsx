'use client'

import { useEffect, useState } from 'react'
import { X, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface SignupPopupProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'faq' | 'exit' // To differentiate where the popup was triggered from
}

export default function SignupPopup({ isOpen, onClose, trigger = 'exit' }: SignupPopupProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleGoogleSignup = () => {
    // Implement Google OAuth signup
    console.log('Google signup clicked')
  }

  const handleFacebookSignup = () => {
    // Implement Facebook OAuth signup
    console.log('Facebook signup clicked')
  }

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Store email in session for signup page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signupEmail', email)
    }
    
    // Redirect to signup/login page with email
    setTimeout(() => {
      window.location.href = `/login?email=${encodeURIComponent(email)}&signup=true`
    }, 300)
  }

  const triggerText = trigger === 'faq' 
    ? 'Before you continue exploring...' 
    : 'Before you leave...'

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {triggerText}
              </h2>
              <p className="text-lg text-gray-600">
                Create amazing AI pet portraits in minutes
              </p>
            </div>

            {/* Value Props */}
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 font-bold text-xl mt-0.5">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">15+ Artistic Styles</p>
                  <p className="text-sm text-gray-600">Disney, Watercolor, Oil Painting & more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-600 font-bold text-xl mt-0.5">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">25+ Backgrounds</p>
                  <p className="text-sm text-gray-600">Studio, Nature, Abstract & more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-blue-600 font-bold text-xl mt-0.5">✓</div>
                <div>
                  <p className="font-semibold text-gray-900">Results in 2-3 Minutes</p>
                  <p className="text-sm text-gray-600">High quality 4K portraits</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-4">
              {/* Google */}
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                size="lg"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>

              {/* Facebook */}
              <Button
                onClick={handleFacebookSignup}
                variant="outline"
                size="lg"
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign up with Facebook
              </Button>

              {/* Email */}
              <form onSubmit={handleEmailSignup} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  {isLoading ? 'Creating account...' : 'Sign up with Email'}
                </Button>
              </form>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{' '}
              <Link href="/terms-conditions" className="text-blue-600 hover:underline">
                Terms
              </Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>

            {/* Skip Link */}
            <button
              onClick={onClose}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
