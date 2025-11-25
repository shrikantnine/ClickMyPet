'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('exitPopupShown')
    if (popupShown) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !hasShown && !showPopup) {
        setShowPopup(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown, showPopup])

  if (!showPopup) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
        onClick={() => setShowPopup(false)}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Wait! Don't Go! 🎁
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Get an <span className="text-5xl font-black text-orange-500">EXTRA 20% OFF</span>
              </p>
              <p className="text-lg text-gray-600">
                Stack with existing discounts!
              </p>
            </div>

            {/* Pricing Examples */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div className="text-sm text-gray-500 line-through">$20</div>
                  <div className="text-lg font-bold text-gray-700 line-through">$15</div>
                  <div className="text-2xl font-black text-orange-600">$12</div>
                  <div className="text-xs text-gray-600 mt-1">Starter</div>
                </div>
                <div className="border-l-2 border-r-2 border-orange-200">
                  <div className="text-sm text-gray-500 line-through">$40</div>
                  <div className="text-lg font-bold text-gray-700 line-through">$29</div>
                  <div className="text-2xl font-black text-orange-600">$23</div>
                  <div className="text-xs text-gray-600 mt-1">Pro</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 line-through">$80</div>
                  <div className="text-lg font-bold text-gray-700 line-through">$49</div>
                  <div className="text-2xl font-black text-orange-600">$39</div>
                  <div className="text-xs text-gray-600 mt-1">Max</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-orange-700">
                Use code: <span className="bg-white px-3 py-1 rounded-full font-mono">SAVE20</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link href="/checkout">
                <Button 
                  size="lg" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl py-6"
                  onClick={() => setShowPopup(false)}
                >
                  Claim My 20% OFF Now! 🚀
                </Button>
              </Link>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                No thanks, I'll pay full price
              </button>
            </div>

            {/* Timer */}
            <div className="mt-4 text-sm text-red-600 font-semibold">
              ⏰ Offer expires in 5 minutes
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
