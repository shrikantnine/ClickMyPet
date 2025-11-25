'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Lock, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProgressBar from '@/components/ProgressBar'

// Type declaration for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

interface PricingPlan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular: boolean
  buttonText: string
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15,
    description: 'Perfect for a tryout',
    features: [
      '20 AI generated images',
      '2 style options',
      '2 background choices',
      'HD resolution',
    ],
    popular: false,
    buttonText: 'Try Now',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Most popular choice',
    features: [
      '40 AI generated images',
      '8 style options',
      'All background choices',
      '2K resolution',
      'Premium accessories',
      'Priority support',
    ],
    popular: true,
    buttonText: 'Go Pro',
  },
  {
    id: 'max',
    name: 'Max',
    price: 49,
    description: 'Best value package',
    features: [
      '100 AI generated images',
      'All style options (15+)',
      'All backgrounds (25+)',
      '4K resolution',
      'All premium accessories',
      'Custom style requests',
      'Commercial usage rights',
      'Priority support',
    ],
    popular: false,
    buttonText: 'Go Max',
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string>('pro')
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }

    setIsLoading(true)

    try {
      // Create order on server
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: selectedPlan }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Razorpay checkout options
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Click My Pet',
        description: `${data.planName} Plan`,
        order_id: data.orderId,
        prefill: {
          name: data.userName,
          email: data.userEmail,
        },
        theme: {
          color: '#2563eb', // Blue-600
        },
        handler: async function (response: any) {
          // Payment successful, verify on server
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              // Redirect to success page
              router.push(
                `/payment-success?subscription=${verifyData.subscriptionId}`
              )
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            alert(
              'Payment successful but verification failed. Please contact support.'
            )
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to initiate payment. Please try again.'
      )
      setIsLoading(false)
    }
  }

  const selectedPlanData = pricingPlans.find((plan) => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PX</span>
              </div>
              <span className="font-bold text-xl text-gray-900">PetPX</span>
            </div>

            <Link
              href="/onboarding"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 py-8 px-4">
        <ProgressBar 
          currentStep={2} 
          totalSteps={2} 
          labels={['Preferences', 'Plan & Payment']}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              <strong>7-day money-back guarantee.</strong>
              <br />
              Not happy with your AI pet photos? We offer refunds if you're not satisfied with the results.
              <br />
              Your satisfaction is our priority.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-600 bg-blue-50 shadow-2xl scale-105'
                    : plan.popular
                    ? 'border-blue-300 bg-white shadow-lg hover:shadow-xl'
                    : 'border-gray-200 bg-white shadow-md hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {selectedPlan === plan.id && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          {selectedPlanData && (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{selectedPlanData.name} Plan</span>
                  <span className="font-semibold text-gray-900">
                    ${selectedPlanData.price}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${selectedPlanData.price}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={isLoading || !razorpayLoaded}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Proceed to Secure Payment
                  </>
                )}
              </Button>

              {/* Test Button - Bypass Payment for Development */}
              <Button
                onClick={() => {
                  // Bypass payment and go to success page with test subscription
                  router.push(`/payment-success?subscription=test_${selectedPlan}_${Date.now()}`)
                }}
                variant="outline"
                size="lg"
                className="w-full mt-3 border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 text-lg py-6"
              >
                🧪 Test Mode - Skip Payment
              </Button>
              <p className="text-xs text-yellow-600 text-center mt-2">
                Development only: Bypass payment to test post-purchase flow
              </p>

              {/* Security badges */}
              <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our{' '}
                <Link href="/terms-conditions" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
