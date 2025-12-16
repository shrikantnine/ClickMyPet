'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Sparkles, 
  Upload, 
  Download,
  Check,
  AlertCircle,
  ArrowRight,
  Camera,
  Loader2,
  CheckCircle2,
  Package,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const MAX_REFERENCE_PHOTOS = 5

// Pet types from onboarding
const PET_TYPES = [
  { id: 'dog', label: 'Dog', emoji: '🐕' },
  { id: 'cat', label: 'Cat', emoji: '🐈' },
  { id: 'bird', label: 'Bird', emoji: '🦜' },
  { id: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { id: 'hamster', label: 'Hamster', emoji: '🐹' },
  { id: 'other', label: 'Other', emoji: '🐾' },
]

interface GeneratedImage {
  id: string
  url: string
  style: string
  selected: boolean
}

interface UserPreferences {
  styles: string[]
  backgrounds: string[]
  accessories: string[]
  customInputs?: {
    style?: string
    background?: string
    accessory?: string
  }
}

interface SubscriptionData {
  id: string
  plan_id: string
  plan_name: string
  images_total: number
  status: string
}

type DashboardStep = 'pet-type' | 'upload' | 'generating' | 'results'

export default function UserDashboard() {
  const router = useRouter()
  
  // Core state
  const [currentStep, setCurrentStep] = useState<DashboardStep>('pet-type')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTestMode, setIsTestMode] = useState(false)
  
  // User data
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  
  // Pet info
  const [petType, setPetType] = useState<string>('')
  const [petBreed, setPetBreed] = useState('')
  const [petName, setPetName] = useState('')
  
  // Photo upload
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  
  // Generation
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  
  // Download
  const [isDownloading, setIsDownloading] = useState(false)

  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      
      // Check for test mode (bypass authentication for testing)
      const testModeEnabled = typeof window !== 'undefined' && (
        sessionStorage.getItem('testMode') === 'true' ||
        new URLSearchParams(window.location.search).get('test') === 'true'
      )
      
      if (testModeEnabled) {
        setIsTestMode(true)
        // Use test data for development/testing
        const testPlan = sessionStorage.getItem('testPlan') || 'pro'
        setUserId('test-user-id')
        setUserEmail('test@petpx.com')
        setSubscription({
          id: 'test-subscription-id',
          plan_id: testPlan,
          plan_name: testPlan === 'starter' ? 'Starter' : testPlan === 'pro' ? 'Pro' : 'Ultra',
          images_total: testPlan === 'starter' ? 10 : testPlan === 'pro' ? 40 : 100,
          status: 'active',
        })
        
        // Load preferences from session storage
        try {
          const stored = sessionStorage.getItem('userPreferences')
          if (stored) {
            const parsed = JSON.parse(stored)
            setPreferences({
              styles: parsed.styles || [],
              backgrounds: parsed.backgrounds || [],
              accessories: parsed.accessories || [],
              customInputs: parsed.customInputs,
            })
          }
        } catch (e) {
          console.error('Failed to load preferences:', e)
        }
        
        setIsLoading(false)
        return
      }
      
      // Check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        return
      }

      setUserId(user.id)
      setUserEmail(user.email || null)

      // Fetch user subscription
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subError || !subscriptionData) {
        setError('No active subscription found. Please complete your purchase first.')
        setIsLoading(false)
        return
      }

      setSubscription({
        id: subscriptionData.id,
        plan_id: subscriptionData.plan_id,
        plan_name: subscriptionData.plan_id === 'starter' ? 'Starter' : subscriptionData.plan_id === 'pro' ? 'Pro' : 'Ultra',
        images_total: subscriptionData.images_total,
        status: subscriptionData.status,
      })

      // Load preferences from session storage
      try {
        const stored = sessionStorage.getItem('userPreferences')
        if (stored) {
          const parsed = JSON.parse(stored)
          setPreferences({
            styles: parsed.styles || [],
            backgrounds: parsed.backgrounds || [],
            accessories: parsed.accessories || [],
            customInputs: parsed.customInputs,
          })
        }
      } catch (e) {
        console.error('Failed to load preferences:', e)
      }

      // Check if user already has generated images
      const { data: existingImages } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20)

      if (existingImages && existingImages.length > 0) {
        const images: GeneratedImage[] = []
        existingImages.forEach(img => {
          if (img.image_urls) {
            img.image_urls.forEach((url: string, idx: number) => {
              images.push({
                id: `${img.id}-${idx}`,
                url,
                style: img.style,
                selected: false,
              })
            })
          }
        })
        if (images.length > 0) {
          setGeneratedImages(images)
          setCurrentStep('results')
        }
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading user data:', error)
      setError('Failed to load your data. Please try again.')
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : []
    if (!fileList.length) return

    const availableSlots = MAX_REFERENCE_PHOTOS - uploadedFiles.length
    if (availableSlots <= 0) {
      setError(`You can upload up to ${MAX_REFERENCE_PHOTOS} photos.`)
      e.target.value = ''
      return
    }

    const filesToAdd = fileList.slice(0, availableSlots)

    filesToAdd.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    setUploadedFiles(prev => [...prev, ...filesToAdd])
    e.target.value = ''
    setError(null)
  }

  const handleRemovePhoto = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index))
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleGenerateImages = async () => {
    if (!uploadedFiles.length) {
      setError('Please upload at least one pet photo!')
      return
    }

    if (!petType) {
      setError('Please select your pet type!')
      return
    }

    setIsGenerating(true)
    setError(null)
    setCurrentStep('generating')
    setGenerationProgress(10)
    
    try {
      // Upload reference photos
      const formData = new FormData()
      uploadedFiles.forEach(file => formData.append('files', file))
      formData.append('userId', userId || 'anonymous')

      setGenerationProgress(20)

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload photos')
      }

      const petPhotoUrls: string[] = Array.isArray(uploadResult.uploads)
        ? uploadResult.uploads.map((item: { url?: string }) => item?.url).filter(Boolean)
        : uploadResult.url ? [uploadResult.url] : []

      if (!petPhotoUrls.length) {
        throw new Error('No photos were uploaded. Please try again.')
      }

      setGenerationProgress(40)

      // Build selections from preferences
      const selectionsPayload = {
        petType,
        petBreed: petBreed || undefined,
        petName: petName || undefined,
        style: preferences?.styles?.[0] || 'professional-portrait',
        background: preferences?.backgrounds?.[0] || 'studio-white',
        accessories: preferences?.accessories || [],
        customInputs: preferences?.customInputs,
      }

      setGenerationProgress(50)

      // Start generation
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selections: selectionsPayload,
          petPhotos: petPhotoUrls,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start generation')
      }

      setGenerationProgress(60)

      // Poll for completion
      if (result.generationId) {
        await pollGenerationStatus(result.generationId)
      } else {
        // Fallback: reload user data to check for new images
        setGenerationProgress(100)
        await loadUserData()
        setCurrentStep('results')
      }
      
    } catch (error) {
      console.error('Generation error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate images')
      setCurrentStep('upload')
    } finally {
      setIsGenerating(false)
    }
  }

  const pollGenerationStatus = async (generationId: string) => {
    let attempts = 0
    const maxAttempts = 30

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        setError('Generation is taking longer than expected. Please check back later.')
        setCurrentStep('upload')
        return
      }

      try {
        const response = await fetch(`/api/generate-images?id=${generationId}`)
        const result = await response.json()

        setGenerationProgress(Math.min(60 + attempts * 2, 95))

        if (result.status === 'completed') {
          setGenerationProgress(100)
          await loadUserData()
          setCurrentStep('results')
          return
        }

        if (result.status === 'failed') {
          setError(result.error || 'Generation failed. Please try again.')
          setCurrentStep('upload')
          return
        }

        attempts++
        await new Promise(resolve => setTimeout(resolve, 10000))
        return poll()
      } catch (error) {
        console.error('Polling error:', error)
        attempts++
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 10000))
          return poll()
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000))
    await poll()
  }

  const toggleImageSelection = (id: string) => {
    setGeneratedImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    )
  }

  const selectAllImages = () => {
    setGeneratedImages(prev => prev.map(img => ({ ...img, selected: true })))
  }

  const deselectAllImages = () => {
    setGeneratedImages(prev => prev.map(img => ({ ...img, selected: false })))
  }

  const downloadSelectedImages = async () => {
    const selectedImages = generatedImages.filter(img => img.selected)
    
    if (selectedImages.length === 0) {
      setError('Please select at least one image to download.')
      return
    }

    setIsDownloading(true)
    setError(null)

    try {
      if (selectedImages.length === 1) {
        // Single image - direct download
        const response = await fetch(selectedImages[0].url)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `petpx-${selectedImages[0].style}-${Date.now()}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        // Multiple images - create zip using dynamic import
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        const folder = zip.folder('PetPX-Portraits')

        for (let i = 0; i < selectedImages.length; i++) {
          const img = selectedImages[i]
          try {
            const response = await fetch(img.url)
            const blob = await response.blob()
            folder?.file(`portrait-${i + 1}-${img.style}.png`, blob)
          } catch (e) {
            console.error(`Failed to fetch image ${i}:`, e)
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `PetPX-Portraits-${Date.now()}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      // Track download
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'images_downloaded',
          userId,
          count: selectedImages.length,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Download error:', error)
      setError('Failed to download images. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const selectedCount = generatedImages.filter(img => img.selected).length

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your studio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">PetPX</span>
            </Link>

            {subscription && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  <Package className="w-4 h-4" />
                  {subscription.plan_name} Plan
                </div>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { step: 'pet-type', label: 'Pet Type', num: 1 },
              { step: 'upload', label: 'Upload Photos', num: 2 },
              { step: 'generating', label: 'Generating', num: 3 },
              { step: 'results', label: 'Download', num: 4 },
            ].map((item, idx) => {
              const isActive = currentStep === item.step
              const isPast = 
                (currentStep === 'upload' && idx === 0) ||
                (currentStep === 'generating' && idx <= 1) ||
                (currentStep === 'results' && idx <= 2)
              
              return (
                <div key={item.step} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : isPast 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isPast && !isActive ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs">
                        {item.num}
                      </span>
                    )}
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                  {idx < 3 && (
                    <ArrowRight className={`w-4 h-4 mx-2 ${isPast ? 'text-green-400' : 'text-gray-300'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 card-shadow">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 1: Pet Type Selection */}
        {currentStep === 'pet-type' && (
          <div className="bg-white rounded-3xl p-8 card-shadow">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                What type of pet do you have?
              </h1>
              <p className="text-gray-600 text-lg">
                Select your pet type to help us create the perfect portraits
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              {PET_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setPetType(type.id)}
                  className={`p-6 rounded-2xl border-2 transition-all card-shadow-hover ${
                    petType === type.id
                      ? 'border-blue-600 bg-blue-50 scale-105'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="text-5xl mb-3">{type.emoji}</div>
                  <div className="font-semibold text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>

            {/* Optional: Breed and Name */}
            {petType && (
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed (optional)
                  </label>
                  <input
                    type="text"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="e.g., Golden Retriever"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet&apos;s Name (optional)
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="e.g., Luna"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={() => setCurrentStep('upload')}
                disabled={!petType}
                variant="moody-fill"
                className="px-8 py-6 text-lg"
              >
                Continue to Upload
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload Photos */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-3xl p-8 card-shadow">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Upload Your Pet&apos;s Photos
              </h1>
              <p className="text-gray-600 text-lg">
                Add up to {MAX_REFERENCE_PHOTOS} clear photos for the best results
              </p>
            </div>

            {/* Upload Tips */}
            <div className="bg-blue-50 rounded-2xl p-5 mb-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Tips for best results:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Use well-lit, clear photos where your pet&apos;s face is visible
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Include different angles (front, side, 3/4 view)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Avoid blurry, dark, or heavily filtered images
                </li>
              </ul>
            </div>

            {/* Upload Area */}
            <div className="max-w-2xl mx-auto">
              <label className="cursor-pointer block">
                <div className="border-3 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                  <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Click or drag to upload
                  </h3>
                  <p className="text-gray-600">
                    JPG, PNG up to 10MB each
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Preview Grid */}
              {previewUrls.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      {previewUrls.length} of {MAX_REFERENCE_PHOTOS} photos
                    </p>
                    <button
                      onClick={() => { setPreviewUrls([]); setUploadedFiles([]) }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-square">
                        <Image
                          src={url}
                          alt={`Pet photo ${index + 1}`}
                          fill
                          className="object-cover rounded-xl"
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {previewUrls.length < MAX_REFERENCE_PHOTOS && (
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                        <span className="text-3xl text-gray-400">+</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                onClick={() => setCurrentStep('pet-type')}
                variant="outline"
                className="px-6 py-5"
              >
                Back
              </Button>
              <Button
                onClick={handleGenerateImages}
                disabled={uploadedFiles.length === 0 || isGenerating}
                variant="moody-fill"
                className="px-8 py-5 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Portraits
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generating */}
        {currentStep === 'generating' && (
          <div className="bg-white rounded-3xl p-8 card-shadow text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-50"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Creating Your Pet&apos;s Portraits
            </h2>
            <p className="text-gray-600 mb-8">
              Our AI is working its magic. This usually takes 2-3 minutes.
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{generationProgress}% complete</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Please wait...</span>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && (
          <div className="bg-white rounded-3xl p-8 card-shadow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Your Portraits Are Ready! 🎉
              </h1>
              <p className="text-gray-600 text-lg">
                Select the portraits you want to download
              </p>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllImages}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={deselectAllImages}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                >
                  Deselect All
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {selectedCount} of {generatedImages.length} selected
              </p>
            </div>

            {/* Image Grid */}
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {generatedImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => toggleImageSelection(image.id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden group transition-all ${
                      image.selected 
                        ? 'ring-4 ring-blue-500 ring-offset-2 scale-[0.98]' 
                        : 'hover:ring-2 hover:ring-blue-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`Generated portrait - ${image.style}`}
                      fill
                      className="object-cover"
                    />
                    {image.selected && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {image.selected ? 'Selected' : 'Click to select'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No images generated yet.</p>
              </div>
            )}

            {/* Download Button */}
            <div className="text-center">
              <Button
                onClick={downloadSelectedImages}
                disabled={selectedCount === 0 || isDownloading}
                variant="moody-fill"
                className="px-8 py-6 text-lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Preparing Download...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download {selectedCount > 1 ? `${selectedCount} Images (ZIP)` : 'Image'}
                  </>
                )}
              </Button>
              
              {selectedCount > 1 && (
                <p className="text-sm text-gray-500 mt-3">
                  Multiple images will be downloaded as a ZIP file
                </p>
              )}
            </div>
          </div>
        )}

        {/* Plan Summary Card */}
        {subscription && preferences && (preferences.styles?.length > 0 || preferences.backgrounds?.length > 0) && (
          <div className="mt-8 bg-white rounded-2xl p-6 card-shadow">
            <h3 className="font-semibold text-gray-900 mb-4">Your Selected Preferences</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {preferences.styles?.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-2">Styles</p>
                  <div className="flex flex-wrap gap-1">
                    {preferences.styles.slice(0, 3).map(s => (
                      <span key={s} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {s.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {preferences.styles.length > 3 && (
                      <span className="text-gray-400 text-xs">+{preferences.styles.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
              {preferences.backgrounds?.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-2">Backgrounds</p>
                  <div className="flex flex-wrap gap-1">
                    {preferences.backgrounds.slice(0, 3).map(b => (
                      <span key={b} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        {b.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {preferences.backgrounds.length > 3 && (
                      <span className="text-gray-400 text-xs">+{preferences.backgrounds.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
              {preferences.accessories?.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-2">Accessories</p>
                  <div className="flex flex-wrap gap-1">
                    {preferences.accessories.slice(0, 3).map(a => (
                      <span key={a} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                        {a.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {preferences.accessories.length > 3 && (
                      <span className="text-gray-400 text-xs">+{preferences.accessories.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
