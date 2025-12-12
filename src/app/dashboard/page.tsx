'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Sparkles, 
  Upload, 
  Crown, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Check,
  Zap,
  Download,
  Share2,
  Heart,
  TrendingUp,
  Gift,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const MAX_REFERENCE_PHOTOS = 5

interface Subscription {
  plan: string
  imagesRemaining: number
  totalImages: number
  expiresAt: string
  status: 'active' | 'expired'
}

interface GeneratedImage {
  id: string
  url: string
  style: string
  createdAt: string
  favorite: boolean
}

interface GenerationJob {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  referenceImages?: string[]
}

export default function UserDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'subscription'>('generate')
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState<string>('professional-portrait')
  const [selectedBackground, setSelectedBackground] = useState<string>('studio-white')
  const [selectedAccessory, setSelectedAccessory] = useState<string>('none')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [petType, setPetType] = useState<'dog' | 'cat' | 'other'>('dog')
  const [petBreed, setPetBreed] = useState('')
  const [petName, setPetName] = useState('')
  const [customNotes, setCustomNotes] = useState('')

  // Load user data and check authentication
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Not logged in - redirect to login or use test mode
        console.log('No user found - using test mode')
        // Set test data for development
        setUserId('test-user-id')
        setUserEmail('test@clickmypet.com')
        setSubscription({
          plan: 'Pro',
          imagesRemaining: 35,
          totalImages: 40,
          expiresAt: '2025-12-05',
          status: 'active'
        })
        setIsLoading(false)
        return
      }

      setUserId(user.id)
      setUserEmail(user.email || null)

      // Fetch user subscription from database
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (subError) {
        console.error('Error fetching subscription:', subError)
        // Use test data if no subscription found
        setSubscription({
          plan: 'Pro',
          imagesRemaining: 35,
          totalImages: 40,
          expiresAt: '2025-12-05',
          status: 'active'
        })
      } else if (subscriptionData) {
        setSubscription({
          plan: subscriptionData.plan_name || 'Pro',
          imagesRemaining: subscriptionData.images_remaining || 0,
          totalImages: subscriptionData.images_total || 40,
          expiresAt: subscriptionData.expires_at || '2025-12-05',
          status: subscriptionData.status || 'active'
        })
      }

      // Fetch user's generated images
      const { data: imagesData, error: imgError } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (imgError) {
        console.error('Error fetching images:', imgError)
      } else if (imagesData) {
        setGeneratedImages(imagesData.map(img => ({
          id: img.id,
          url: img.image_url,
          style: img.style,
          createdAt: img.created_at,
          favorite: img.favorite || false
        })))
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading user data:', error)
      // Fallback to test mode on error
      setUserId('test-user-id')
      setUserEmail('test@clickmypet.com')
      setSubscription({
        plan: 'Pro',
        imagesRemaining: 35,
        totalImages: 40,
        expiresAt: '2025-12-05',
        status: 'active'
      })
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : []
    if (!fileList.length) {
      return
    }

    const availableSlots = MAX_REFERENCE_PHOTOS - uploadedFiles.length
    if (availableSlots <= 0) {
      alert(`You can upload up to ${MAX_REFERENCE_PHOTOS} photos per batch.`)
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
  }

  const handleRemovePhoto = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, idx) => idx !== index))
    setPreviewUrls(prev => prev.filter((_, idx) => idx !== index))
  }

  const handleGenerateImages = async () => {
    if (!uploadedFiles.length) {
      alert('Please upload at least one pet photo first!')
      return
    }

    if (!subscription || subscription.imagesRemaining <= 0) {
      alert('You have no credits remaining. Please upgrade your plan.')
      setActiveTab('subscription')
      return
    }

    setIsGenerating(true)
    setGenerationError(null)
    
    try {
      const formData = new FormData()
      uploadedFiles.forEach(file => formData.append('files', file))
      formData.append('userId', userId || 'anonymous')

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload reference photos')
      }

      const petPhotoUrls: string[] = Array.isArray(uploadResult.uploads)
        ? uploadResult.uploads
            .map((item: { url?: string }) => item?.url)
            .filter((url): url is string => Boolean(url))
        : uploadResult.url
          ? [uploadResult.url]
          : []

      if (!petPhotoUrls.length) {
        throw new Error('No reference photos were saved. Please try again.')
      }

      const selectionsPayload = {
        petType,
        petBreed: petBreed || undefined,
        petName: petName || undefined,
        style: selectedStyle,
        background: selectedBackground,
        accessories: selectedAccessory && selectedAccessory !== 'none' ? [selectedAccessory] : [],
        customNotes: customNotes || undefined,
      }

      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selections: selectionsPayload,
          petPhotos: petPhotoUrls,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to start generation')
      }

      alert(result.message || '🎉 Image generation started! Your portraits will be ready shortly.')

      setUploadedFiles([])
      setPreviewUrls([])

      if (result.generationId) {
        pollGenerationStatus(result.generationId)
      }
      
    } catch (error) {
      console.error('Generation error:', error)
      const message = error instanceof Error ? error.message : 'Failed to generate images'
      setGenerationError(message)
      alert('Error: ' + message)
    } finally {
      setIsGenerating(false)
    }
  }

  const pollGenerationStatus = async (generationId: string) => {
    let attempts = 0
    const maxAttempts = 30

    const poll = async () => {
      if (attempts >= maxAttempts) {
        console.log('Polling timeout - check gallery manually')
        return
      }

      try {
        const response = await fetch(`/api/generate-images?id=${generationId}`)
        const result = await response.json()

        if (result.status === 'completed') {
          await loadUserData()
          alert('✨ Your images are ready! Check the Gallery tab.')
          setActiveTab('gallery')
          return
        }

        if (result.status === 'failed') {
          alert(result.error || '❌ Image generation failed. Please try again.')
          return
        }

        attempts++
        setTimeout(poll, 10000)
      } catch (error) {
        console.error('Polling error:', error)
        attempts++
        setTimeout(poll, 10000)
      }
    }

    setTimeout(poll, 5000)
  }

  const styles = [
    { id: 'professional-portrait', name: 'Professional Portrait', emoji: '👔' },
    { id: 'watercolor-art', name: 'Watercolor Art', emoji: '🎨' },
    { id: 'vintage-film', name: 'Vintage Film', emoji: '📷' },
    { id: 'disney-pixar', name: 'Disney Pixar', emoji: '🎬' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖' },
    { id: 'renaissance', name: 'Renaissance', emoji: '🖼️' },
    { id: 'minimalist', name: 'Minimalist', emoji: '⚪' },
    { id: 'oil-painting', name: 'Oil Painting', emoji: '🖌️' },
  ]

  const petTypes = [
    { id: 'dog' as const, label: 'Dog', emoji: '🐶' },
    { id: 'cat' as const, label: 'Cat', emoji: '🐱' },
    { id: 'other' as const, label: 'Other', emoji: '🦊' },
  ]

  const backgrounds = [
    { id: 'studio-white', name: 'Studio White', emoji: '⚪' },
    { id: 'nature-garden', name: 'Nature Garden', emoji: '🌿' },
    { id: 'beach-sunset', name: 'Beach Sunset', emoji: '🏖️' },
    { id: 'urban-city', name: 'Urban City', emoji: '🏙️' },
    { id: 'cozy-home', name: 'Cozy Home', emoji: '🏠' },
    { id: 'mountain-landscape', name: 'Mountain', emoji: '⛰️' },
    { id: 'fantasy-magical', name: 'Fantasy Magical', emoji: '✨' },
    { id: 'autumn-forest', name: 'Autumn Forest', emoji: '🍂' },
  ]

  const accessories = [
    { id: 'none', name: 'None', emoji: '∅' },
    { id: 'bow-tie', name: 'Bow Tie', emoji: '🎀' },
    { id: 'crown', name: 'Crown', emoji: '👑' },
    { id: 'bandana', name: 'Bandana', emoji: '🧣' },
    { id: 'flower-crown', name: 'Flower Crown', emoji: '🌸' },
    { id: 'sunglasses', name: 'Sunglasses', emoji: '😎' },
    { id: 'hat', name: 'Hat', emoji: '🎩' },
    { id: 'scarf', name: 'Scarf', emoji: '🧣' },
  ]

  const progressPercentage = subscription 
    ? ((subscription.totalImages - subscription.imagesRemaining) / subscription.totalImages) * 100 
    : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CMP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Click My Pet</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Credits Badge */}
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">{subscription?.imagesRemaining} credits left</span>
              </div>

              {/* User Menu */}
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome to Your Dashboard! 🎉
              </h1>
              <p className="text-blue-100 text-lg">
                Start creating amazing AI-generated pet portraits
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-1">{subscription?.imagesRemaining}</div>
              <div className="text-sm text-blue-100">Credits Available</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {subscription?.plan}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Active Plan</h3>
            <p className="text-2xl font-bold text-gray-900">{subscription?.plan} Membership</p>
          </div>

          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Images Generated</h3>
            <p className="text-2xl font-bold text-gray-900">
              {subscription ? subscription.totalImages - subscription.imagesRemaining : 0}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-black/90" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Usage</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-2xl card-shadow">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'generate'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Images</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>My Gallery</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === 'subscription'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span>Subscription</span>
                </div>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Create Your Pet's Portrait
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Upload a photo and choose a style to generate stunning AI portraits
                  </p>
                </div>

                {/* Upload Section */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Pet Type</p>
                        <div className="flex flex-wrap gap-2">
                          {petTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => setPetType(type.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                                petType === type.id
                                  ? 'border-blue-600 bg-white shadow'
                                  : 'border-blue-200 bg-white/70 hover:border-blue-400'
                              }`}
                            >
                              <span>{type.emoji}</span>
                              {type.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Breed (optional)</label>
                        <input
                          type="text"
                          value={petBreed}
                          onChange={(event) => setPetBreed(event.target.value)}
                          placeholder="Golden Retriever"
                          className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Pet Name (optional)</label>
                        <input
                          type="text"
                          value={petName}
                          onChange={(event) => setPetName(event.target.value)}
                          placeholder="Luna"
                          className="w-full rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <label className="w-full cursor-pointer">
                      <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all hover:bg-white/60">
                        <Upload className="w-14 h-14 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Upload up to {MAX_REFERENCE_PHOTOS} pet photos
                        </h3>
                        <p className="text-gray-600 mb-2">
                          Clear, well-lit photos work best. Add different angles for better character lock.
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports JPG/PNG • Max 10MB each
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

                    {previewUrls.length > 0 && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                          {previewUrls.map((url, index) => (
                            <div key={`${url}-${index}`} className="relative group">
                              <Image
                                src={url}
                                alt={`Uploaded pet ${index + 1}`}
                                width={320}
                                height={320}
                                loading="lazy"
                                className="rounded-xl shadow-lg w-full h-48 object-cover"
                              />
                              <button
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                aria-label="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          {previewUrls.length}/{MAX_REFERENCE_PHOTOS} photos ready • add more for better character capture
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Style Selection */}
                {previewUrls.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        1. Choose Your Style
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {styles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedStyle === style.id
                                ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-4xl mb-2">{style.emoji}</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {style.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background Selection */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        2. Choose Background
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {backgrounds.map((bg) => (
                          <button
                            key={bg.id}
                            onClick={() => setSelectedBackground(bg.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedBackground === bg.id
                                ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-4xl mb-2">{bg.emoji}</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {bg.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accessory Selection */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        3. Add Accessories (Optional)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {accessories.map((acc) => (
                          <button
                            key={acc.id}
                            onClick={() => setSelectedAccessory(acc.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedAccessory === acc.id
                                ? 'border-pink-600 bg-pink-50 shadow-lg scale-105'
                                : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                            }`}
                          >
                            <div className="text-4xl mb-2">{acc.emoji}</div>
                            <div className="text-sm font-semibold text-gray-900">
                              {acc.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        4. Special Instructions (Optional)
                      </h3>
                      <textarea
                        value={customNotes}
                        onChange={(event) => setCustomNotes(event.target.value)}
                        placeholder="Add any specific poses, props, or moods you'd like us to try."
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Error Display */}
                {generationError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Generation Failed</h4>
                      <p className="text-sm text-red-700">{generationError}</p>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                {previewUrls.length > 0 && (
                  <div className="text-center">
                    <Button
                      onClick={handleGenerateImages}
                      disabled={
                        isGenerating ||
                        !subscription ||
                        subscription.imagesRemaining <= 0 ||
                        uploadedFiles.length === 0
                      }
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-6 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-2" />
                          Generate AI Portraits
                          <span className="ml-2 text-sm text-white/80">
                            ({previewUrls.length}/{MAX_REFERENCE_PHOTOS} refs)
                          </span>
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                      {subscription?.imagesRemaining ? (
                        <>
                          {subscription.imagesRemaining} credits remaining • Generations take ~2-3 minutes
                        </>
                      ) : (
                        <span className="text-red-600 font-semibold">No credits remaining - Please upgrade</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-yellow-600" />
                    Pro Tips for Best Results:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Use clear, well-lit photos with your pet's face visible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Avoid blurry or dark images for best quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Generation takes 2-3 minutes - we'll notify you when ready!</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Your Generated Images
                  </h2>
                  <p className="text-gray-600 text-lg">
                    View, download, and share your AI-generated pet portraits
                  </p>
                </div>

                {generatedImages.length === 0 ? (
                  <div className="text-center py-16">
                    <ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      No images yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start generating your first AI pet portrait!
                    </p>
                    <Button
                      onClick={() => setActiveTab('generate')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Your First Image
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                        <Image
                          src={image.url}
                          alt={`Generated ${image.style}`}
                          width={300}
                          height={300}
                          loading="lazy"
                          className="w-full h-auto aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                            <Download className="w-5 h-5 text-gray-900" />
                          </button>
                          <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                            <Share2 className="w-5 h-5 text-gray-900" />
                          </button>
                          <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                            <Heart className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Your Subscription
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Manage your plan and billing
                  </p>
                </div>

                {/* Current Plan */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="w-8 h-8 text-yellow-500" />
                        <h3 className="text-2xl font-bold text-gray-900">{subscription?.plan} Plan</h3>
                      </div>
                      <p className="text-gray-600">
                        Active until {new Date(subscription?.expiresAt || '').toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {subscription?.imagesRemaining}
                      </div>
                      <div className="text-sm text-gray-600">credits left</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-white rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${(subscription?.imagesRemaining || 0) / (subscription?.totalImages || 1) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {subscription?.imagesRemaining} / {subscription?.totalImages}
                    </span>
                  </div>
                </div>

                {/* Upgrade Options */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Need More Credits?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Add Credits */}
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">⚡</div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Add More Credits
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Top up your existing plan
                        </p>
                      </div>
                      <Link href="/checkout">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Add Credits
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    {/* Upgrade Plan */}
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-6 hover:shadow-lg transition-all">
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">👑</div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          Upgrade to Max
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Get 100 credits + premium features
                        </p>
                      </div>
                      <Link href="/checkout">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Upgrade Now
                          <Crown className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="bg-gray-50 rounded-xl p-6 mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Billing Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-semibold text-gray-900">•••• •••• •••• 4242</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing Date</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(subscription?.expiresAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>

                {/* Support */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                  <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to help you with any questions.
                  </p>
                  <a
                    href="mailto:support@clickmypet.com"
                    className="text-blue-600 hover:underline font-semibold text-sm"
                  >
                    Contact Support →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
