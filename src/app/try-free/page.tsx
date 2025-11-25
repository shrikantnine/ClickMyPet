'use client'

import type { Metadata } from 'next'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Upload, Sparkles, AlertCircle, Check } from 'lucide-react'
import { setVisitorEmail } from '@/lib/visitor-tracking'

// Note: Metadata export doesn't work in client components
// SEO is handled via layout or dynamic route
// For client pages, consider using next/head in a wrapper

export default function TryFreePage() {
  const router = useRouter()
  
  // Authentication state
  const [email, setEmail] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
  // Selection state
  const [selectedStyle, setSelectedStyle] = useState('')
  const [selectedBackground, setSelectedBackground] = useState('')
  const [selectedAccessory, setSelectedAccessory] = useState('none')
  
  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false)

  const styles = [
    { id: 'professional-portrait', name: 'Professional', emoji: '👔', description: 'Studio quality' },
    { id: 'watercolor-art', name: 'Watercolor', emoji: '🎨', description: 'Artistic paint' },
    { id: 'vintage-film', name: 'Vintage', emoji: '📷', description: 'Classic film' },
    { id: 'disney-pixar', name: 'Disney', emoji: '🏰', description: '3D animated' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🤖', description: 'Futuristic neon' },
    { id: 'renaissance', name: 'Renaissance', emoji: '🖼️', description: 'Classical art' },
    { id: 'minimalist', name: 'Minimalist', emoji: '⚪', description: 'Clean & simple' },
    { id: 'oil-painting', name: 'Oil Painting', emoji: '🖌️', description: 'Rich texture' },
  ]

  const backgrounds = [
    { id: 'studio-white', name: 'Studio White', emoji: '⚪', description: 'Clean backdrop' },
    { id: 'nature-garden', name: 'Garden', emoji: '🌸', description: 'Lush greenery' },
    { id: 'beach-sunset', name: 'Beach', emoji: '🌅', description: 'Golden hour' },
    { id: 'urban-city', name: 'Urban', emoji: '🏙️', description: 'City lights' },
    { id: 'cozy-home', name: 'Home', emoji: '🏠', description: 'Warm interior' },
    { id: 'mountain-landscape', name: 'Mountains', emoji: '⛰️', description: 'Majestic peaks' },
    { id: 'fantasy-magical', name: 'Fantasy', emoji: '✨', description: 'Magical world' },
    { id: 'autumn-forest', name: 'Forest', emoji: '🍂', description: 'Fall colors' },
  ]

  const accessories = [
    { id: 'none', name: 'None', emoji: '🚫', description: 'Natural look' },
    { id: 'bow-tie', name: 'Bow Tie', emoji: '🎀', description: 'Elegant' },
    { id: 'crown', name: 'Crown', emoji: '👑', description: 'Royal' },
    { id: 'bandana', name: 'Bandana', emoji: '🧣', description: 'Casual cool' },
    { id: 'flower-crown', name: 'Flowers', emoji: '🌸', description: 'Boho chic' },
    { id: 'sunglasses', name: 'Sunglasses', emoji: '😎', description: 'Cool vibes' },
    { id: 'hat', name: 'Hat', emoji: '🎩', description: 'Fashionable' },
    { id: 'scarf', name: 'Scarf', emoji: '🧣', description: 'Cozy warm' },
  ]

  const handleTestBypass = () => {
    // Test bypass without email - creates anonymous session
    const testUserId = `test_${Date.now()}`
    setUserId(testUserId)
    setIsAuthenticated(true)
    setEmail('test@clickmypet.com')
    setHasUsedFreeTrial(false)
    
    // Track event
    trackEvent('test_bypass_used', { userId: testUserId })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      // Track signup started
      trackEvent('signup_started', { email })

      // Link visitor with email
      setVisitorEmail(email)

      // Call authentication API (simplified for now)
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send magic link')
      }

      // Show success message
      alert(`✅ Check your email! We sent a magic link to ${email}`)
      
      // Track signup completed
      trackEvent('signup_completed', { email })

      // For now, auto-authenticate for testing
      const mockUserId = `user_${Date.now()}`
      setUserId(mockUserId)
      setIsAuthenticated(true)

      // Check if user already used free trial
      await checkFreeTrialStatus(mockUserId)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const checkFreeTrialStatus = async (uid: string) => {
    try {
      const response = await fetch(`/api/check-free-trial?userId=${uid}&email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (data.hasUsedFreeTrial) {
        setHasUsedFreeTrial(true)
        setError('You have already used your free trial. Please choose a plan to continue.')
      }
    } catch (err) {
      console.error('Failed to check free trial status:', err)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      // Track upload
      trackEvent('upload_completed', { userId, fileSize: file.size })
    }
  }

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedStyle || !selectedBackground) {
      setError('Please upload a photo and select style & background')
      return
    }

    if (hasUsedFreeTrial) {
      router.push('/checkout')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Track generation started
      trackEvent('generation_started', {
        userId,
        style: selectedStyle,
        background: selectedBackground,
        accessory: selectedAccessory,
      })

      // Upload image
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('userId', userId || 'anonymous')

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Failed to upload image')
      }

      // Call generation API
      const genResponse = await fetch('/api/generate-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          email: email,
          petPhotoUrl: uploadResult.url,
          style: selectedStyle,
          background: selectedBackground,
          accessory: selectedAccessory,
          planId: 'free-trial',
          isFreeTrail: true,
        }),
      })

      const genResult = await genResponse.json()

      if (!genResponse.ok) {
        // Check if it's a "already used" error
        if (genResult.hasUsedFreeTrial) {
          setHasUsedFreeTrial(true)
          setError(genResult.error)
          return
        }
        throw new Error(genResult.error || 'Failed to generate image')
      }

      // Track generation completed
      trackEvent('generation_completed', {
        userId,
        jobId: genResult.jobId,
        style: selectedStyle,
        background: selectedBackground,
        accessory: selectedAccessory,
      })

      // Redirect to result page with job ID
      router.push(`/result?jobId=${genResult.jobId}&userId=${userId}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      trackEvent('generation_failed', { userId, error: err })
    } finally {
      setIsGenerating(false)
    }
  }

  const trackEvent = async (eventName: string, data: any) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          timestamp: new Date().toISOString(),
          ...data,
        }),
      })
    } catch (err) {
      console.error('Analytics tracking failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">CMP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Click My Pet</span>
            </Link>
            
            {isAuthenticated && (
              <div className="text-sm text-gray-600">
                {email}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {!isAuthenticated ? (
          /* Authentication Section */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Get Your Free Portrait!
                </h1>
                <p className="text-gray-600">
                  Create one stunning AI portrait for free. No credit card required.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-bold"
                >
                  {isLoading ? 'Sending...' : '✨ Continue with Email'}
                </Button>
              </form>

              {/* Test Bypass Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleTestBypass}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3"
                >
                  🧪 Test Mode (Skip Email)
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  For testing only - will be removed before launch
                </p>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>1 free portrait</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>2 min setup</span>
                </div>
              </div>
            </div>
          </div>
        ) : hasUsedFreeTrial ? (
          /* Already Used Free Trial */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You've Already Used Your Free Trial
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ready to create more amazing portraits? Choose a plan and get started!
              </p>
              <Link href="/checkout">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold">
                  View Pricing Plans →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Creation Flow */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className={`flex items-center gap-2 ${uploadedFile ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${uploadedFile ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {uploadedFile ? '✓' : '1'}
                    </div>
                    <span className="font-semibold">Upload</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <div className={`flex items-center gap-2 ${selectedStyle ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${selectedStyle ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {selectedStyle ? '✓' : '2'}
                    </div>
                    <span className="font-semibold">Style</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <div className={`flex items-center gap-2 ${selectedBackground ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${selectedBackground ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                      {selectedBackground ? '✓' : '3'}
                    </div>
                    <span className="font-semibold">Background</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-300"></div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-gray-200">
                      4
                    </div>
                    <span className="font-semibold">Generate</span>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create Your Free AI Portrait
              </h1>
              <p className="text-gray-600 mb-8 text-center">
                Upload your pet's photo and customize your portrait
              </p>

              {/* Step 1: Upload */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Upload Your Pet's Photo</h3>
                
                {!previewUrl ? (
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG, or WEBP (max. 10MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="relative">
                    <Image
                      src={previewUrl}
                      alt="Pet preview"
                      width={300}
                      height={300}
                      loading="lazy"
                      className="mx-auto rounded-lg object-cover"
                    />
                    <Button
                      onClick={() => {
                        setUploadedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>

              {/* Step 2: Choose Style */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Choose Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedStyle === style.id
                          ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-2">{style.emoji}</div>
                      <div className="font-semibold text-sm text-gray-900">{style.name}</div>
                      <div className="text-xs text-gray-500">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Choose Background */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Choose Background</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedBackground === bg.id
                          ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-2">{bg.emoji}</div>
                      <div className="font-semibold text-sm text-gray-900">{bg.name}</div>
                      <div className="text-xs text-gray-500">{bg.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Optional Accessory */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">4. Add Accessory (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {accessories.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccessory(acc.id)}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedAccessory === acc.id
                          ? 'border-pink-600 bg-pink-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
                      }`}
                    >
                      <div className="text-3xl mb-2">{acc.emoji}</div>
                      <div className="font-semibold text-sm text-gray-900">{acc.name}</div>
                      <div className="text-xs text-gray-500">{acc.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!uploadedFile || !selectedStyle || !selectedBackground || isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Your Portrait...
                  </>
                ) : (
                  <>
                    ✨ Generate My FREE Portrait
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                🎁 This is completely free • No credit card required • Takes ~2 minutes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
