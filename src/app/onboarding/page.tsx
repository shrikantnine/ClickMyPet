'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, ArrowLeft, Lock, Zap } from 'lucide-react'
import ProgressBar from '@/components/ProgressBar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

// Plan limits
const PLAN_LIMITS: Record<string, { styles: number; backgrounds: number; accessories: number }> = {
  starter: { styles: 4, backgrounds: 2, accessories: 0 },
  pro: { styles: 8, backgrounds: 99, accessories: 4 }, // 99 means all
  ultra: { styles: 99, backgrounds: 99, accessories: 99 },
}

// Style options
const styles = [
  { id: 'realistic', name: 'Realistic Portrait', image: '/Dog/Golden Retriever Santa Xmas.png' },
  { id: 'superhero', name: 'Superhero', image: '/Cat/Persian Cat Superhero Superman.png' },
  { id: 'royal', name: 'Royal Portrait', image: '/Dog/Poodle Ex Royalty Portrait.png' },
  { id: 'cool', name: 'Cool & Casual', image: '/Dog/Beagle Cool Portrait Glasses Hat.png' },
  { id: 'gangster', name: 'Gangster', image: '/Dog/Bulldog Gangster Chilling In Car.png' },
  { id: 'professional', name: 'Professional', image: '/Dog/German Shepherd Suite Portrait.png' },
  { id: 'christmas', name: 'Christmas', image: '/Cat/Bombay Cat Sant Christmas Xmas.png' },
  { id: 'action', name: 'Action Shot', image: '/Dog/Labrador Retriever Jump.png' },
]

// Background options
const backgrounds = [
  { id: 'studio', name: 'Studio Background', preview: '#f5f5f5' },
  { id: 'outdoor', name: 'Outdoor Scene', preview: '#87CEEB' },
  { id: 'luxury', name: 'Luxury Interior', preview: '#D4AF37' },
  { id: 'nature', name: 'Nature', preview: '#228B22' },
  { id: 'urban', name: 'Urban Street', preview: '#696969' },
  { id: 'beach', name: 'Beach', preview: '#F0E68C' },
  { id: 'abstract', name: 'Abstract', preview: '#FF6B6B' },
  { id: 'custom', name: 'Custom', preview: '#9370DB' },
]

// Accessory options
const accessories = [
  { id: 'glasses', name: 'Glasses', emoji: '🕶️' },
  { id: 'hat', name: 'Hat', emoji: '🎩' },
  { id: 'chain', name: 'Gold Chain', emoji: '⛓️' },
  { id: 'bow', name: 'Bow Tie', emoji: '🎀' },
  { id: 'crown', name: 'Crown', emoji: '👑' },
  { id: 'cape', name: 'Cape', emoji: '🦸' },
  { id: 'scarf', name: 'Scarf', emoji: '🧣' },
  { id: 'bandana', name: 'Bandana', emoji: '👒' },
]

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [planId, setPlanId] = useState(searchParams.get('plan') || 'starter')
  const limits = PLAN_LIMITS[planId] || PLAN_LIMITS.starter

  const [step, setStep] = useState(1)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState('')

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
        // Trigger upsell modal
        setUpgradeReason(type)
        setShowUpgradeModal(true)
      }
    }
  }

  const handleUpgrade = () => {
    // Upgrade logic: switch to next tier
    const nextPlan = planId === 'starter' ? 'pro' : 'ultra'
    setPlanId(nextPlan)
    setShowUpgradeModal(false)
    // Update URL without reload
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('plan', nextPlan)
    window.history.pushState({}, '', newUrl)
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save preferences and redirect to checkout
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  const handleComplete = async () => {
    // Save user preferences to database
    try {
      const preferences = {
        styles: selectedStyles,
        backgrounds: selectedBackgrounds,
        accessories: selectedAccessories,
        plan: planId,
      }
      
      // Store in session storage for now
      sessionStorage.setItem('userPreferences', JSON.stringify(preferences))
      
      // Redirect to checkout
      router.push(`/checkout?plan=${planId}`)
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  const canProceed = () => {
    if (step === 1) return selectedStyles.length > 0
    if (step === 2) return selectedBackgrounds.length > 0
    if (step === 3) return true // Accessories are optional
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PX</span>
              </div>
              <span className="font-bold text-xl text-gray-900">PetPX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 py-8 px-4">
        <ProgressBar 
          currentStep={step} 
          totalSteps={3} 
          labels={['Styles', 'Backgrounds', 'Accessories']}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Step 1: Select Styles */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg shadow-sm mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Choose Your Favorite Styles
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedStyles.length}</span> / {limits.styles}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style) => (
                <div
                  key={style.id}
                  onClick={() =>
                    toggleSelection(style.id, selectedStyles, setSelectedStyles, limits.styles, 'styles')
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 group ${
                    selectedStyles.includes(style.id)
                      ? 'border-blue-600 shadow-xl scale-105'
                      : 'border-transparent hover:border-blue-300'
                  }`}
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
                    </p>
                  </div>
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Backgrounds */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg shadow-sm mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Pick Your Backgrounds
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedBackgrounds.length}</span> / {limits.backgrounds === 99 ? 'All' : limits.backgrounds}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() =>
                    toggleSelection(
                      bg.id,
                      selectedBackgrounds,
                      setSelectedBackgrounds,
                      limits.backgrounds,
                      'backgrounds'
                    )
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-6 group ${
                    selectedBackgrounds.includes(bg.id)
                      ? 'border-blue-600 shadow-xl scale-105'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  style={{ backgroundColor: bg.preview }}
                >
                  <div className="h-32 flex items-center justify-center">
                    <p className="text-white font-bold text-xl text-center drop-shadow-lg group-hover:scale-110 transition-transform">
                      {bg.name}
                    </p>
                  </div>
                  {selectedBackgrounds.includes(bg.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Accessories */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center sticky top-20 z-40 bg-white/90 backdrop-blur py-2 rounded-lg shadow-sm mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Add Fun Accessories
              </h1>
              <p className="text-lg text-gray-700">
                Selected: <span className="font-bold text-blue-600">{selectedAccessories.length}</span> / {limits.accessories === 99 ? 'All' : limits.accessories}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {accessories.map((accessory) => {
                const isLocked = limits.accessories === 0
                return (
                  <div
                    key={accessory.id}
                    onClick={() =>
                      toggleSelection(
                        accessory.id,
                        selectedAccessories,
                        setSelectedAccessories,
                        limits.accessories,
                        'accessories'
                      )
                    }
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-8 bg-white group ${
                      selectedAccessories.includes(accessory.id)
                        ? 'border-blue-600 shadow-xl scale-105'
                        : 'border-gray-300 hover:border-blue-300'
                    } ${isLocked ? 'opacity-75 hover:opacity-100' : ''}`}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{accessory.emoji}</div>
                      <p className="font-semibold text-gray-800">
                        {accessory.name}
                      </p>
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedAccessories.includes(accessory.id) && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}

                    {/* Lock Icon for Starter Plan */}
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
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-6 h-6 text-yellow-500 fill-current" />
              Unlock More Possibilities!
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              {upgradeReason === 'accessories' 
                ? "Accessories are only available on Pro and Ultra plans. Upgrade now to add fun props to your pet's portraits!"
                : `You've reached the limit for your current plan. Upgrade to unlock more ${upgradeReason} and get faster delivery!`}
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
      <div className="bg-white border-t border-gray-200 sticky bottom-0 z-50 shadow-xl">
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
                Step {step} of 3:{' '}
                {step === 1
                  ? 'Styles'
                  : step === 2
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
              {step === 3 ? 'Continue to Checkout' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
