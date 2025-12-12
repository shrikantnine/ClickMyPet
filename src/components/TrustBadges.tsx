import { Lock, RefreshCw, Shield, Zap } from 'lucide-react'

export default function TrustBadges() {
  return (
    <section className="py-8 px-4 bg-gray-50 border-y border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Trust Points - Single Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-6 text-xs md:text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-600" />
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>7-Day Money Back</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-black/90" />
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-600" />
            <span>1-2 Min Delivery</span>
          </div>
        </div>

        {/* Payment Icons - Single Line */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Visa */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <path d="M20.5 11h-3.2l-2 10h3.2l2-10zm7.4 6.5l1.7-4.6.9 4.6h-2.6zm3.6 3.5h3l-2.6-10h-2.7c-.6 0-1.1.3-1.3.8l-4.6 9.2h3.4l.7-1.8h4.1v1.8zm-8.2-3.3c0-2.6-3.6-2.8-3.6-4 0-.4.4-.7 1.2-.8.4 0 1.6-.1 2.9.5l.5-2.4c-.7-.3-1.7-.5-2.9-.5-3 0-5.2 1.6-5.2 3.9 0 1.7 1.5 2.6 2.7 3.2 1.2.6 1.6.9 1.6 1.4 0 .8-.9 1.1-1.8 1.1-1.5 0-2.3-.2-3.5-.8l-.6 2.5c.8.4 2.3.7 3.8.7 3.3.1 5.4-1.5 5.4-3.9l-.5.1z" fill="#1434CB"/>
          </svg>

          {/* Mastercard */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <circle cx="18" cy="16" r="6" fill="#EB001B"/>
            <circle cx="30" cy="16" r="6" fill="#F79E1B"/>
            <path d="M24 11.5a5.95 5.95 0 00-2 4.5 5.95 5.95 0 002 4.5 5.95 5.95 0 002-4.5 5.95 5.95 0 00-2-4.5z" fill="#FF5F00"/>
          </svg>

          {/* PayPal */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <path d="M20 10h-4l-2.5 12h3l.7-3.5h2c2.5 0 4-1.2 4.3-3.5.3-2-1-5-3.5-5zm.5 5c-.2 1.2-1 1.5-2 1.5h-1l.7-3.5h1c1 0 1.5.3 1.3 2zm8-5h-3l.7-3.5h-3l-2 10h3l.8-4h2c1.2 0 1.5.5 1.3 1.5l-.5 2.5h3l.6-3c.4-2-.5-3.5-2.9-3.5z" fill="#003087"/>
          </svg>

          {/* American Express */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="#006FCF"/>
            <path d="M16 13h-2.5l-1.5 3.5-1.5-3.5H8l2.5 6h2l2.5-6zm4 0h-2v6h2v-6zm5 0h-3v6h3c1.5 0 2.5-1 2.5-3s-1-3-2.5-3zm0 4.5h-1v-3h1c.7 0 1 .5 1 1.5s-.3 1.5-1 1.5zm6-4.5l-1 3-1-3h-2l2 6h2l2-6h-2z" fill="white"/>
          </svg>

          {/* Apple Pay */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <path d="M18.5 13.5c-.3.4-.8.7-1.3.6-.1-.5.1-1.1.4-1.4.3-.4.9-.7 1.3-.7.1.5 0 1.1-.4 1.5zm.4.7c-.7 0-1.3.4-1.6.4s-.9-.4-1.5-.4c-.8 0-1.5.4-1.9 1.1-.8 1.4-.2 3.5.6 4.6.4.6.8 1.2 1.4 1.2.6 0 .8-.4 1.5-.4s.9.4 1.5.4 1-.5 1.4-1.2c.4-.7.6-1.3.6-1.4 0 0-1.2-.5-1.2-1.8 0-1.1.9-1.6.9-1.6-.5-.7-1.3-.8-1.6-.8l-.1-.1zm5.6-1.2v7h1.1v-2.4h1.5c1.4 0 2.3-.9 2.3-2.3s-.9-2.3-2.3-2.3h-2.6zm1.1 1h1.4c1 0 1.5.5 1.5 1.3s-.5 1.3-1.5 1.3h-1.4v-2.6z" fill="black"/>
          </svg>

          {/* Amazon Pay */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <path d="M18 18c-3 2-7.3 3-11 3-.5 0-1-.1-1-.1.5.5 1.5.8 2.5.8 2.5 0 6-1.5 9.5-3.7z" fill="#FF9900"/>
            <path d="M24 16.5c0 1-.3 1.8-.8 2.3-.8.8-2 1.2-3.2 1.2-1.8 0-3.2-.8-3.2-2.5 0-2.7 2.5-3.5 5-3.5h2.2v2.5zm3-5.5c0-.8-.1-1.5-.3-2-.2-.5-.6-.8-1.2-.8-.6 0-1 .3-1.2.8-.2.5-.3 1.2-.3 2v7h-3v-9c1-.3 2.2-.5 3.5-.5 1.5 0 2.7.3 3.5 1 .8.7 1.2 1.8 1.2 3.2v5.3h-2.2v-7z" fill="#221F1F"/>
          </svg>

          {/* Google Pay */}
          <svg className="h-6 w-10" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="3" fill="white" stroke="#e5e7eb"/>
            <path d="M23.5 16v3h-2v-6h3.3c.8 0 1.5.3 2 .8.5.5.8 1.2.8 2s-.3 1.5-.8 2c-.5.5-1.2.8-2 .8l-1.3-.6zm0-3.8v2.6h1.3c.4 0 .7-.1 1-.4.3-.3.4-.6.4-1s-.1-.7-.4-1c-.3-.3-.6-.4-1-.4h-1.3v.2zm9.5 2.3c0 .8-.2 1.5-.7 2-.5.6-1.2.9-2 .9-.8 0-1.5-.3-2-.9s-.7-1.2-.7-2 .2-1.5.7-2c.5-.6 1.2-.9 2-.9.8 0 1.5.3 2 .9.5.5.7 1.2.7 2zm-2 0c0-.5-.1-.9-.4-1.2-.3-.3-.6-.5-1-.5s-.7.2-1 .5c-.3.3-.4.7-.4 1.2s.1.9.4 1.2c.3.3.6.5 1 .5s.7-.2 1-.5c.3-.3.4-.7.4-1.2z" fill="#5F6368"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
