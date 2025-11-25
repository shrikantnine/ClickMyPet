'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Sparkles, Download, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subscriptionId = searchParams.get('subscription')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Countdown redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      // Redirect to user dashboard after successful payment
      router.push('/dashboard')
    }
  }, [countdown, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Thank you for your purchase! Your subscription is now active.
          </p>

          {/* Subscription Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                What's Next?
              </h2>
            </div>
            <ul className="space-y-3 text-left max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Your subscription has been activated
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  You can now start generating AI pet photos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  A confirmation email has been sent to your inbox
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  Refund available if not satisfied
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full">
                Start Creating Pet Photos
              </Button>
            </Link>
          </div>

          {/* Subscription ID */}
          {subscriptionId && (
            <p className="text-xs text-gray-500 mt-6">
              Subscription ID: {subscriptionId}
            </p>
          )}

          {/* Auto-redirect countdown */}
          <p className="text-sm text-gray-600 mt-6">
            Redirecting to your dashboard in {countdown} seconds...
          </p>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-700">
            Need help?{' '}
            <a
              href="mailto:support@clickmypet.com"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
