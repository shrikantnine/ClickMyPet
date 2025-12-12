"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, Lock, ArrowLeft, Shield, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProgressBar from '@/components/ProgressBar'
import { PRICING_PLANS, type PricingPlan } from '@/lib/pricing'

type PlanId = keyof typeof PRICING_PLANS

interface StoredPreferences {
  plan?: string
  styles?: string[]
  backgrounds?: string[]
  accessories?: string[]
}

const ORDERED_PLAN_IDS: PlanId[] = ['starter', 'pro', 'ultra']
const DISPLAY_PLANS: PricingPlan[] = ORDERED_PLAN_IDS.map((id) => PRICING_PLANS[id])
const DELIVERY_SPEED: Record<PlanId, string> = {
  starter: '≈15 minutes',
  pro: '≈10 minutes',
  ultra: '≈5 minutes',
}

const guaranteePoints = [
  {
    icon: Shield,
    title: 'Money-back guarantee',
    detail: 'Full refund within 48h if you are not in love with the portraits.',
  },
  {
    icon: Lock,
    title: 'Secure checkout',
    detail: 'Powered by Razorpay with PCI DSS compliance & 256-bit encryption.',
  },
  {
    icon: Clock,
    title: 'Express delivery',
    detail: 'Studio delivers previews in minutes and the full pack shortly after.',
  },
  {
    icon: Zap,
    title: 'Creative direction',
    detail: 'Pro & Ultra plans unlock automatic prompt diversity for varied looks.',
  },
]

declare global {
  interface Window {
    Razorpay?: any
  }
}

const isPlanId = (value: string | null): value is PlanId => {
  return value === 'starter' || value === 'pro' || value === 'ultra'
}

const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`

const formatLabel = (value: string) =>
  value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planFromQuery = searchParams.get('plan')

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    isPlanId(planFromQuery) ? planFromQuery : 'pro'
  )
  const [preferences, setPreferences] = useState<StoredPreferences | null>(null)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.sessionStorage.getItem('userPreferences')
      if (stored) {
        const parsed: StoredPreferences = JSON.parse(stored)
        setPreferences(parsed)
        if (parsed.plan && isPlanId(parsed.plan)) {
          setSelectedPlan(parsed.plan)
        }
      }
    } catch (err) {
      console.error('Failed to parse stored preferences', err)
    } finally {
      setPreferencesLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!planFromQuery || !isPlanId(planFromQuery)) {
      return
    }
    setSelectedPlan(planFromQuery)
  }, [planFromQuery])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.Razorpay) {
      setIsRazorpayReady(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setIsRazorpayReady(true)
    script.onerror = () =>
      setError('Unable to load the payment gateway. Please refresh and try again.')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    setError(null)
  }, [selectedPlan])

  const selectedPlanData = PRICING_PLANS[selectedPlan]

  const limitWarnings = useMemo(() => {
    if (!preferences) return []
    const warnings: string[] = []
    const styleCount = preferences.styles?.length || 0
    const backgroundCount = preferences.backgrounds?.length || 0
    const accessoriesCount = preferences.accessories?.length || 0

    if (selectedPlanData.styleOptions !== 99 && styleCount > selectedPlanData.styleOptions) {
      warnings.push(
        `This plan includes ${selectedPlanData.styleOptions} styles. We'll auto-prioritize your favourites, or upgrade to keep all ${styleCount}.`
      )
    }

    if (
      selectedPlanData.backgroundOptions !== 99 &&
      backgroundCount > selectedPlanData.backgroundOptions
    ) {
      warnings.push(
        `You selected ${backgroundCount} backgrounds. ${selectedPlanData.name} covers ${selectedPlanData.backgroundOptions}.`
      )
    }

    if (!selectedPlanData.accessories && accessoriesCount > 0) {
      warnings.push('Accessories are locked on this plan. Upgrade to keep hats, bows, and fun props.')
    }

    return warnings
  }, [preferences, selectedPlanData])

  const selectionMismatch =
    preferences?.plan && isPlanId(preferences.plan) && preferences.plan !== selectedPlan

  const renderPreferenceRow = (label: string, values?: string[]) => {
    if (!values || values.length === 0) {
      return (
        <p className="text-sm text-gray-500">No {label.toLowerCase()} selected yet.</p>
      )
    }

    return (
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={`${label}-${value}`}
            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            {formatLabel(value)}
          </span>
        ))}
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!selectedPlanData) return
    if (!isRazorpayReady) {
      setError('Payment gateway is still initializing. Please try again in a moment.')
      return
    }

    setIsPaying(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: selectedPlanData.id,
          preferences: preferences || {},
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to start the checkout session.')
      }

      if (!window.Razorpay) {
        throw new Error('Payment SDK is not ready. Please refresh the page.')
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PetPX',
        description: `${selectedPlanData.name} Plan`,
        order_id: data.orderId,
        prefill: {
          name: data.userName || '',
          email: data.userEmail || '',
        },
        notes: {
          planId: selectedPlanData.id,
          origin: 'checkout-page',
        },
        theme: { color: '#2563eb' },
        handler: async (paymentResponse: any) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentResponse),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.')
            }

            router.push(`/payment-success?subscription=${verifyData.subscriptionId}`)
          } catch (verifyError) {
            setError(
              verifyError instanceof Error
                ? verifyError.message
                : 'Payment verification failed.'
            )
          } finally {
            setIsPaying(false)
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (failure: any) => {
        setError(failure.error?.description || 'Payment failed. Please try again or use another card.')
        setIsPaying(false)
      })
      razorpay.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while starting the payment.')
      setIsPaying(false)
    }
  }

  const renderPlanCard = (plan: PricingPlan) => {
    const isSelected = selectedPlan === (plan.id as PlanId)
    return (
      <button
        key={plan.id}
        type="button"
        onClick={() => setSelectedPlan(plan.id as PlanId)}
        className={`relative w-full rounded-xl border-2 p-4 text-left transition-all card-shadow-hover ${
          isSelected
            ? 'border-blue-600 bg-blue-50 scale-[1.01]'
            : plan.popular
            ? 'border-blue-200 bg-white'
            : 'border-gray-200 bg-white'
        }`}
      >
        {plan.popular && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            Most Popular
          </span>
        )}
        {isSelected && (
          <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
            <Check className="h-5 w-5" />
          </div>
        )}
        <div className="mb-2 text-center">
          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
          <p className="text-2xl font-black text-gray-900">{formatCurrency(plan.price)}</p>
          <p className="text-[11px] text-gray-500">{plan.imageCount} images • {plan.resolution}</p>
        </div>
        <ul className="mt-3 space-y-1 text-xs text-gray-600">
          {plan.features.slice(0, 4).map((feature) => (
            <li key={`${plan.id}-${feature}`} className="flex items-start gap-1">
              <Check className="mt-0.5 h-3 w-3 text-green-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-4 py-5 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Step 5 · Checkout</p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">Pick a plan & pay</h1>
          <p className="mt-2 text-sm text-white/80">
            One-time payment. 48h money-back guarantee.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
            <Link href="/onboarding">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {preferencesLoaded && !preferences && (
          <div className="mb-6 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600">
            We couldn’t find your style selections. Please restart the personalization flow so we can tailor your AI prompts.
            <Link href="/onboarding" className="ml-2 font-semibold text-blue-600 underline">
              Restart onboarding
            </Link>
          </div>
        )}

        {selectionMismatch && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            You originally chose the {formatLabel(preferences?.plan || '')} plan. Feel free to keep it or explore other options below.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="order-2 lg:order-1 space-y-6">
            <section>
              <h2 className="mb-3 text-base font-semibold text-gray-900">Select plan</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {DISPLAY_PLANS.map((plan) => renderPlanCard(plan))}
              </div>
            </section>

            {/* Hidden on initial load for brevity; user can expand if needed */}
            {preferences && (
              <details className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">Your creative brief <span className="text-gray-400">(click to expand)</span></summary>
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-gray-400">Styles</p>
                    {renderPreferenceRow('Styles', preferences?.styles)}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Backgrounds</p>
                    {renderPreferenceRow('Backgrounds', preferences?.backgrounds)}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-400">Accessories</p>
                    {renderPreferenceRow('Accessories', preferences?.accessories)}
                  </div>
                </div>
                {limitWarnings.length > 0 && (
                  <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800">
                    <p className="font-semibold">Heads up</p>
                    <ul className="mt-1 list-disc pl-4">
                      {limitWarnings.map((warning, idx) => (
                        <li key={`w-${idx}`}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </details>
            )}
          </div>

          <aside className="order-1 lg:order-2 space-y-4">
            <div className="sticky top-4 rounded-2xl border border-gray-100 bg-white p-5 card-shadow">
              <p className="text-xs font-semibold uppercase text-blue-600">Order summary</p>
              <h3 className="text-xl font-bold text-gray-900">{selectedPlanData.name} Plan</h3>
              <p className="mb-4 text-xs text-gray-500">{selectedPlanData.imageCount} images • {selectedPlanData.resolution} • {DELIVERY_SPEED[selectedPlan]}</p>
              <div className="flex items-center justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(selectedPlanData.price)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={!isRazorpayReady || isPaying}
                variant="moody-fill"
                className="mt-4 w-full py-5 text-base font-semibold"
              >
                {isPaying ? 'Processing…' : `Pay ${formatCurrency(selectedPlanData.price)}`}
              </Button>
              <p className="mt-2 text-center text-[11px] text-gray-400">
                Secure checkout by Razorpay • 48h refund guarantee
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function CheckoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-sm text-gray-600">Loading checkout…</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
