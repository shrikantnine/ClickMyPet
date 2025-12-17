'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, Star, X } from 'lucide-react'
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
    ? ' '
    : ' '

  const portraits = [
    {
      src: '/Dog/Shiba Inu Portrait.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Cat/Persian Cat Superhero Superman.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Dog/French Bulldog Royal Portrait.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Cat/Birman Cat Portrait.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Dog/Golden Retriever Santa Xmas.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Cat/Bengal Cat On Skateboard.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Dog/Doberman Pinscher Gold Chain Portrait.png',
      alt: 'AI pet portrait example',
    },
    {
      src: '/Cat/Siberian Cat Royal Portrait.png',
      alt: 'AI pet portrait example',
    },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center p-0 md:p-4 animate-in zoom-in duration-300">
        <div className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[65vh] overflow-y-auto md:overflow-hidden rounded-none md:rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed md:absolute top-4 right-4 z-50 text-black/60 hover:text-black/90 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 md:h-full">
            {/* Left: portraits + social proof */}
            <div className="relative bg-gray-900/90 text-white p-4 md:p-6 md:h-full md:flex md:flex-col md:overflow-hidden">
              <div className="space-y-3 md:space-y-4">
                <p className="text-sm text-white/70">{triggerText}</p>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight">
                  Thousands of{' '}
                  <span className="text-blue-300">AI pet portraits</span>
                  {' '}generated for happy pet parents
                </h2>
              </div>

              {/* Desktop photo grid (8 photos, 2 rows) */}
              <div className="hidden md:grid grid-cols-4 gap-2 md:gap-3 my-4">
                {portraits.map((p) => (
                  <div key={p.src} className="relative overflow-hidden rounded-xl card-shadow">
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="(min-width: 768px) 12vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile photo grid (4 photos, 2x2) */}
              <div className="grid md:hidden grid-cols-2 gap-2 my-4">
                {portraits.slice(0, 4).map((p) => (
                  <div key={p.src} className="relative overflow-hidden rounded-xl card-shadow">
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        sizes="50vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <p className="text-sm text-white/80">
                  Over <span className="font-semibold text-white">1,250+</span> reviews
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">4.8</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: offer + email + testimonial */}
            <div className="bg-white/90 backdrop-blur-lg p-4 md:p-6 text-gray-900 md:h-full md:flex md:flex-col md:overflow-hidden">
              <div className="space-y-5 md:space-y-6">
                <h3 className="text-4xl md:text-5xl font-bold">
                  Get <span className="text-blue-600">10% off</span>
                </h3>
                <p className="mt-2 text-base md:text-lg text-gray-700">
                  Get your AI-generated pet portraits today. As a promotional offer, get 10% off on your purchase.
                </p>
              </div>

              <form onSubmit={handleEmailSignup} className="space-y-4 my-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-3 md:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full py-6 md:py-6 text-base md:text-lg font-bold"
                  variant="moody-fill"
                >
                  {isLoading ? 'Creating account…' : 'Get discount'}
                </Button>
              </form>

              <div className="my-4 rounded-2xl bg-white card-shadow border border-gray-100 p-4 md:p-5">
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  “Amazing results - I was able to generate realistic fun portraits of my pet, highly satisfied with the outcome.”
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-700 font-bold">
                      DP
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Douglass D.</p>
                      <p className="text-xs md:text-sm text-gray-500">Verified customer</p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
