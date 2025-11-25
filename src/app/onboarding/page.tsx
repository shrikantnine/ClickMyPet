'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import ProgressBar from '@/components/ProgressBar'

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
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])

  const toggleSelection = (
    id: string,
    current: string[],
    setter: (value: string[]) => void
  ) => {
    if (current.includes(id)) {
      setter(current.filter((item) => item !== id))
    } else {
      setter([...current, id])
    }
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
      }
      
      // Store in session storage for now
      sessionStorage.setItem('userPreferences', JSON.stringify(preferences))
      
      // Redirect to checkout
      router.push('/checkout')
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
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Choose Your Favorite Styles
              </h1>
              <p className="text-lg text-gray-700">
                Select one or more styles you'd like for your pet photos
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {styles.map((style) => (
                <div
                  key={style.id}
                  onClick={() =>
                    toggleSelection(style.id, selectedStyles, setSelectedStyles)
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 ${
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-semibold text-center">
                      {style.name}
                    </p>
                  </div>
                  {selectedStyles.includes(style.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Pick Your Backgrounds
              </h1>
              <p className="text-lg text-gray-700">
                Choose the backgrounds you'd like for your pet photos
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
                      setSelectedBackgrounds
                    )
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-6 ${
                    selectedBackgrounds.includes(bg.id)
                      ? 'border-blue-600 shadow-xl scale-105'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  style={{ backgroundColor: bg.preview }}
                >
                  <div className="h-32 flex items-center justify-center">
                    <p className="text-white font-bold text-xl text-center drop-shadow-lg">
                      {bg.name}
                    </p>
                  </div>
                  {selectedBackgrounds.includes(bg.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Add Fun Accessories
              </h1>
              <p className="text-lg text-gray-700">
                Optional: Select accessories to add personality (skip if you prefer natural)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {accessories.map((accessory) => (
                <div
                  key={accessory.id}
                  onClick={() =>
                    toggleSelection(
                      accessory.id,
                      selectedAccessories,
                      setSelectedAccessories
                    )
                  }
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all border-4 p-8 bg-white ${
                    selectedAccessories.includes(accessory.id)
                      ? 'border-blue-600 shadow-xl scale-105'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3">{accessory.emoji}</div>
                    <p className="font-semibold text-gray-800">
                      {accessory.name}
                    </p>
                  </div>
                  {selectedAccessories.includes(accessory.id) && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
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
