'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, ArrowLeft, Lock, Zap, Mail, Eye, EyeOff } from 'lucide-react'
import ProgressBar from '@/components/ProgressBar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

// Plan limits
const PLAN_LIMITS: Record<string, { styles: number; backgrounds: number; accessories: number }> = {
  starter: { styles: 4, backgrounds: 2, accessories: 0 },
  pro: { styles: 8, backgrounds: 99, accessories: 4 },
  ultra: { styles: 99, backgrounds: 99, accessories: 99 },
}

// Style options - organized in /public/onboarding/styles/
const styles = [
  { id: 'realistic', name: 'Realistic Portrait', image: '/onboarding/styles/realistic.png', isCustom: false },
  { id: 'superhero', name: 'Superhero', image: '/onboarding/styles/superhero.png', isCustom: false },
  { id: 'royal', name: 'Royal Portrait', image: '/onboarding/styles/royal.png', isCustom: false },
  { id: 'cool', name: 'Cool & Casual', image: '/onboarding/styles/cool.png', isCustom: false },
  { id: 'gangster', name: 'Gangster', image: '/onboarding/styles/gangster.png', isCustom: false },
  { id: 'professional', name: 'Professional', image: '/onboarding/styles/professional.png', isCustom: false },
  { id: 'christmas', name: 'Christmas', image: '/onboarding/styles/christmas.png', isCustom: false },
  { id: 'action', name: 'Action Shot', image: '/onboarding/styles/action.png', isCustom: false },
  { id: 'animated', name: 'Animated', image: '/onboarding/styles/animated.png', isCustom: false },
  { id: 'abstract-art', name: 'Abstract Art', image: '/onboarding/styles/abstract-art.png', isCustom: false },
  { id: 'monochrome', name: 'Monochrome', image: '/onboarding/styles/monochrome.png', isCustom: false },
  { id: 'newspaper', name: 'Newspaper', image: '/onboarding/styles/newspaper.png', isCustom: false },
  { id: 'at-work', name: 'At Work', image: '/onboarding/styles/at-work.png', isCustom: false },
  { id: 'sports', name: 'Sports', image: '/onboarding/styles/sports.png', isCustom: false },
  { id: 'close-up', name: 'Close-Up', image: '/onboarding/styles/close-up.png', isCustom: false },
  { id: 'nature', name: 'Nature', image: '/onboarding/styles/nature.png', isCustom: false },
  { id: 'dressed', name: 'Dressed To Impress', image: '/onboarding/styles/dressed.png', isCustom: false },
  { id: 'custom-style', name: 'Custom', image: '/onboarding/styles/custom.png', isCustom: true, maxOnly: true },
]

// Background options
const backgrounds = [
  { id: 'studio-dark', name: 'Studio Dark', preview: '#1a1a1a', isCustom: false },
  { id: 'studio-light', name: 'Studio Light', preview: '#f5f5f5', isCustom: false },
  { id: 'nature', name: 'Nature', preview: '#228B22', isCustom: false },
  { id: 'city', name: 'City', preview: '#4a5568', isCustom: false },
  { id: 'beach', name: 'Beach', preview: '#F0E68C', isCustom: false },
  { id: 'street', name: 'Street', preview: '#696969', isCustom: false },
  { id: 'luxury', name: 'Luxury Interior', preview: '#D4AF37', isCustom: false },
  { id: 'abstract', name: 'Abstract', preview: '#FF6B6B', isCustom: false },
  { id: 'custom-background', name: 'Custom', preview: '#9370DB', isCustom: true, maxOnly: true },
]

// Accessory options
const accessories = [
  { id: 'glasses', name: 'Glasses', emoji: '🕶️', isCustom: false },
  { id: 'hat', name: 'Hat', emoji: '🎩', isCustom: false },
  { id: 'chain', name: 'Gold Chain', emoji: '⛓️', isCustom: false },
  { id: 'bow', name: 'Bow Tie', emoji: '🎀', isCustom: false },
  { id: 'crown', name: 'Crown', emoji: '👑', isCustom: false },
  { id: 'jacket', name: 'Jacket', emoji: '🧥', isCustom: false },
  { id: 'hoodie', name: 'Hoodie', emoji: '👕', isCustom: false },
  { id: 'goggles', name: 'Goggles', emoji: '🥽', isCustom: false },
  { id: 'shirt', name: 'Shirt', emoji: '👔', isCustom: false },
  { id: 'custom-accessory', name: 'Custom', emoji: '✨', isCustom: true, maxOnly: true },
]

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [planId, setPlanId] = useState(searchParams.get('plan') || 'starter')
  const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.starter

  // Steps: 1 = Sign Up, 2 = Styles, 3 = Backgrounds, 4 = Accessories
  const [step, setStep] = useState(1)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')
  
  // Custom input states for Max (Ultra) users
  const [customStyleText, setCustomStyleText] = useState('')
  const [customBackgroundText, setCustomBackgroundText] = useState('')
  const [customAccessoryText, setCustomAccessoryText] = useState('')
  const isMaxUser = planId === 'ultra'

  const toggleSelection = (
    id: string,
    current: string[],
    setter: (value: string[]) => void,
    limit: number,
    type: 'styles' | 'backgrounds' | 'accessories'
  ) => {
    if (current.includes(id)) {
      setter(current.filter((item) => item !== id))
    } else {
      if (current.length < limit) {
        setter([...current, id])
      } else {
        setUpgradeReason(type)
        setShowUpgradeModal(true)
      }
    }
  }

  const handleUpgrade = () => {
    const nextPlan = planId === 'starter' ? 'pro' : 'ultra'
    setPlanId(nextPlan)
    setShowUpgradeModal(false)
    window.history.replaceState(null, '', `/onboarding?plan=${nextPlan}`)
  }

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign up')
    setIsAuthenticated(true)
    setStep(2)
  }

  const handleFacebookSignUp = () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook sign up')
    setIsAuthenticated(true)
    setStep(2)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement email auth
    console.log('Email auth:', formData)
    setIsAuthenticated(true)
    setStep(2)
  }

  const handleNext = () => {
    if (step === 1 && isAuthenticated) {
      setStep(2)
    } else if (step === 2 && selectedStyles.length > 0) {
      setStep(3)
    } else if (step === 3 && selectedBackgrounds.length > 0) {
      setStep(4)
    } else if (step === 4) {
      // Save preferences and go to checkout
      const preferences = {
        plan: planId,
        styles: selectedStyles,
        backgrounds: selectedBackgrounds,
        accessories: selectedAccessories,
        customInputs: {
          style: customStyleText,
          background: customBackgroundText,
          accessory: customAccessoryText,
        }
      }
      sessionStorage.setItem('userPreferences', JSON.stringify(preferences))
      router.push(`/checkout?plan=${planId}`)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const canProceed = () => {
    if (step === 1) return isAuthenticated
    if (step === 2) return selectedStyles.length > 0
    if (step === 3) return selectedBackgrounds.length > 0
    if (step === 4) return true
    return false
  }

  const getStepLabels = () => {
    return ['Sign Up', 'Styles', 'Backgrounds', 'Accessories']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PX</span>
              </div>
              <span className="font-bold text-xl text-gray-900">PetPX</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 py-8 px-4">
        <ProgressBar 
          currentStep={step} 
          totalSteps={4} 
          labels={getStepLabels()}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Step 1: Sign Up */}
        {step === 1 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-8 card-shadow">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                </h1>
                <p className="text-gray-700">
                  {authMode === 'signup' 
                    ? 'Sign up to create amazing AI pet portraits' 
                    : 'Sign in to continue your creative journey'
                  }
                </p>
              </div>

              {/* Social Sign Up Buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleGoogleSignUp}
                  variant="outline"
                  size="lg"
                  className="w-full bg-white hover:bg-gray-50 border-gray-300 card-shadow-hover text-black/90 font-medium"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  onClick={handleFacebookSignUp}
                  variant="outline"
                  size="lg"
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-[#1877F2] card-shadow-hover"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/50 text-gray-600 rounded">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" variant="moody-fill" size="lg" className="w-full">
                  {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              {/* Toggle auth mode */}
              <div className="text-center mt-6">
                <p className="text-gray-700">
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {authMode === 'signup' ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>

              {/* Privacy note */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By signing up, you agree to our{' '}
                <Link href="/terms-conditions" className="text-blue-600 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Select Styles */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg card-shadow mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Choose Your Favorite Styles
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedStyles.length}</span> / {limits.styles}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style) => {
                const isMaxOnlyItem = 'maxOnly' in style && style.maxOnly
                const isLocked = isMaxOnlyItem && !isMaxUser
                const isSelected = selectedStyles.includes(style.id)
                
                return (
                  <div
                    key={style.id}
                    onClick={() => {
                      if (isLocked) {
                        setUpgradeReason('Custom Style (Max Exclusive)')
                        setShowUpgradeModal(true)
                        return
                      }
                      toggleSelection(style.id, selectedStyles, setSelectedStyles, limits.styles, 'styles')
                    }}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 group card-shadow-hover ${
                      isSelected
                        ? 'border-blue-600 scale-105'
                        : 'border-transparent hover:border-blue-300'
                    } ${isLocked ? 'opacity-75' : ''}`}
                  >
                    <Image
                      src={style.image}
                      alt={style.name}
                      width={300}
                      height={375}
                      loading="lazy"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-semibold text-center text-sm md:text-base">
                        {style.name}
                        {isMaxOnlyItem && <span className="block text-xs text-yellow-400">✨ Max Exclusive</span>}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Custom Style Input for Max users */}
            {selectedStyles.includes('custom-style') && isMaxUser && (
              <div className="max-w-md mx-auto mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border border-blue-200 card-shadow">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  ✨ Describe your custom style (Max Exclusive)
                </label>
                <input
                  type="text"
                  value={customStyleText}
                  onChange={(e) => setCustomStyleText(e.target.value.slice(0, 64))}
                  placeholder="e.g., Vintage 1920s detective with monocle"
                  maxLength={64}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{customStyleText.length}/64 characters</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Backgrounds */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg card-shadow mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Pick Your Backgrounds
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedBackgrounds.length}</span> / {limits.backgrounds === 99 ? 'All' : limits.backgrounds}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {backgrounds.map((bg) => {
                const isMaxOnlyItem = 'maxOnly' in bg && bg.maxOnly
                const isLocked = isMaxOnlyItem && !isMaxUser
                const isSelected = selectedBackgrounds.includes(bg.id)
                
                return (
                  <div
                    key={bg.id}
                    onClick={() => {
                      if (isLocked) {
                        setUpgradeReason('Custom Background (Max Exclusive)')
                        setShowUpgradeModal(true)
                        return
                      }
                      toggleSelection(
                        bg.id,
                        selectedBackgrounds,
                        setSelectedBackgrounds,
                        limits.backgrounds,
                        'backgrounds'
                      )
                    }}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-6 group card-shadow-hover ${
                      isSelected
                        ? 'border-blue-600 scale-105'
                        : 'border-gray-300 hover:border-blue-300'
                    } ${isLocked ? 'opacity-75' : ''}`}
                    style={{ backgroundColor: bg.preview }}
                  >
                    <div className="h-32 flex items-center justify-center flex-col">
                      <p className="text-white font-bold text-xl text-center drop-shadow-lg group-hover:scale-110 transition-transform">
                        {bg.name}
                      </p>
                      {isMaxOnlyItem && <span className="text-xs text-yellow-300 mt-1 drop-shadow">✨ Max Exclusive</span>}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute top-2 left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Custom Background Input for Max users */}
            {selectedBackgrounds.includes('custom-background') && isMaxUser && (
              <div className="max-w-md mx-auto mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border border-blue-200 card-shadow">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  ✨ Describe your custom background (Max Exclusive)
                </label>
                <input
                  type="text"
                  value={customBackgroundText}
                  onChange={(e) => setCustomBackgroundText(e.target.value.slice(0, 64))}
                  placeholder="e.g., Magical forest with glowing fireflies"
                  maxLength={64}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{customBackgroundText.length}/64 characters</p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Select Accessories */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg card-shadow mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Add Fun Accessories
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedAccessories.length}</span> / {limits.accessories === 99 ? 'All' : limits.accessories}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {accessories.map((accessory) => {
                const isPlanLocked = limits.accessories === 0
                const isMaxOnlyItem = 'maxOnly' in accessory && accessory.maxOnly
                const isLocked = isPlanLocked || (isMaxOnlyItem && !isMaxUser)
                const isSelected = selectedAccessories.includes(accessory.id)
                
                return (
                  <div
                    key={accessory.id}
                    onClick={() => {
                      if (isMaxOnlyItem && !isMaxUser) {
                        setUpgradeReason('Custom Accessory (Max Exclusive)')
                        setShowUpgradeModal(true)
                        return
                      }
                      if (isPlanLocked) {
                        setUpgradeReason('accessories')
                        setShowUpgradeModal(true)
                        return
                      }
                      toggleSelection(
                        accessory.id,
                        selectedAccessories,
                        setSelectedAccessories,
                        limits.accessories,
                        'accessories'
                      )
                    }}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-8 bg-white group card-shadow-hover ${
                      isSelected
                        ? 'border-blue-600 scale-105'
                        : 'border-gray-300 hover:border-blue-300'
                    } ${isLocked ? 'opacity-75 hover:opacity-100' : ''}`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{accessory.emoji}</div>
                      <p className="font-semibold text-gray-800">
                        {accessory.name}
                      </p>
                      {isMaxOnlyItem && <span className="text-xs text-yellow-600">✨ Max Exclusive</span>}
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {isLocked && (
                      <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="bg-white p-2 rounded-full shadow-lg">
                          <Lock className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Custom Accessory Input for Max users */}
            {selectedAccessories.includes('custom-accessory') && isMaxUser && (
              <div className="max-w-md mx-auto mt-6 p-4 bg-white/80 backdrop-blur rounded-xl border border-blue-200 card-shadow">
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  ✨ Describe your custom accessory (Max Exclusive)
                </label>
                <input
                  type="text"
                  value={customAccessoryText}
                  onChange={(e) => setCustomAccessoryText(e.target.value.slice(0, 64))}
                  placeholder="e.g., Diamond-studded collar with ruby pendant"
                  maxLength={64}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-black/70 text-black/90"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{customAccessoryText.length}/64 characters</p>
              </div>
            )}

            {limits.accessories === 0 && (
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Accessories are locked on the Starter plan.{' '}
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Upgrade to Pro
                  </button>
                  {' '}to unlock fun props!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-5 h-5 text-yellow-500" />
              Unlock More {upgradeReason}!
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Upgrade to unlock more creative options and get amazing results.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-blue-50 p-4 rounded-lg my-2">
            <h4 className="font-semibold text-blue-900 mb-2">Upgrade to Pro & Get:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> 40 AI Images (vs 20)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> 8 Styles & All Backgrounds
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Premium Accessories
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> 10 Min Delivery
              </li>
            </ul>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Maybe Later
            </Button>
            <Button onClick={handleUpgrade} variant="moody-fill" className="border-0">
              Upgrade for just $20 more
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50 card-shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-center hidden md:block">
              <p className="text-sm text-gray-600">
                Step {step} of 4:{' '}
                {step === 1
                  ? 'Sign Up'
                  : step === 2
                  ? 'Styles'
                  : step === 3
                  ? 'Backgrounds'
                  : 'Accessories'}
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              variant="moody-fill"
              size="lg"
              className="flex items-center gap-2"
            >
              {step === 4 ? 'Continue to Checkout' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
