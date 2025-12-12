
 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download, Share2, Sparkles, Clock } from 'lucide-react'

export default function ResultPage() {
  const router = useRouter()
  const [jobId, setJobId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    // Read query params on client to avoid useSearchParams build-time issues
    try {
      const params = new URLSearchParams(window.location.search)
      const j = params.get('jobId')
      const u = params.get('userId')
      setJobId(j)
      setUserId(u)

      if (!j) {
        setError('No job ID provided')
        setIsLoading(false)
        return
      }

      // start polling after we set jobId
      pollJobStatus()
    } catch (err) {
      setError('Failed to read query params')
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pollJobStatus = async () => {
    const maxPolls = 30 // 5 minutes max (30 * 10 seconds)
    
    const poll = async () => {
      try {
        const response = await fetch(`/api/generate-simple?jobId=${jobId}`)
        const data = await response.json()

        if (data.status === 'completed' && data.imageUrls && data.imageUrls.length > 0) {
          setImageUrl(data.imageUrls[0])
          setIsLoading(false)
          
          // Track view event
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'result_viewed',
              userId,
              jobId,
              timestamp: new Date().toISOString()
            })
          })
          
          return
        } else if (data.status === 'failed') {
          setError('Generation failed. Please try again.')
          setIsLoading(false)
          return
        }

        // Still processing
        setPollCount(prev => prev + 1)
        
        if (pollCount < maxPolls) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else {
          setError('Generation is taking longer than expected. Please check back later.')
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Polling error:', err)
        setPollCount(prev => prev + 1)
        if (pollCount < maxPolls) {
          setTimeout(poll, 10000)
        } else {
          setError('Failed to check generation status')
          setIsLoading(false)
        }
      }
    }

    // Start first poll after 5 seconds
    setTimeout(poll, 5000)
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `my-pet-portrait-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Track download
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'image_downloaded',
          userId,
          jobId,
        })
      })
    } catch (err) {
      console.error('Download error:', err)
      alert('Failed to download image')
    }
  }

  const handleShare = () => {
    if (navigator.share && imageUrl) {
      navigator.share({
        title: 'My Pet Portrait from Click My Pet',
        text: 'Check out this amazing AI-generated portrait of my pet!',
        url: window.location.href,
      })
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }

    // Track share
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'image_shared',
        userId,
        jobId,
      })
    })
  }

  const handleUpgrade = () => {
    // Track upsell click
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'upsell_clicked',
        userId,
        source: 'result_page',
      })
    })

    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CMP</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Click My Pet</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          /* Loading State */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-6 animate-pulse">
                <Clock className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Creating Your Portrait...
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI is working its magic! This usually takes about 2-3 minutes.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min((pollCount / 18) * 100, 90)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                {pollCount < 6 ? 'Starting generation...' : pollCount < 12 ? 'Processing your image...' : 'Almost there...'}
              </p>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
                <span className="text-4xl">😞</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Oops! Something Went Wrong
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {error}
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/try-free">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Try Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="max-w-4xl mx-auto">
            {/* Result Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Your Portrait is Ready!
                </h1>
                <p className="text-lg text-gray-600">
                  Here's your stunning AI-generated pet portrait
                </p>
              </div>

              {/* Image Display */}
              <div className="relative mb-8">
                <Image
                  src={imageUrl || '/placeholder.jpg'}
                  alt="Generated pet portrait"
                  width={800}
                  height={800}
                  className="w-full rounded-lg shadow-2xl"
                  priority
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Upsell Card */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  🎉 Love It? Get 40 More!
                </h2>
                <p className="text-xl mb-6 opacity-90">
                  Create unlimited professional portraits for all occasions
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="font-semibold">8 Styles</div>
                    <div className="text-sm opacity-80">Professional to Disney</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="text-3xl mb-2">🌄</div>
                    <div className="font-semibold">8 Backgrounds</div>
                    <div className="text-sm opacity-80">Studio to Fantasy</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="text-3xl mb-2">👑</div>
                    <div className="font-semibold">8 Accessories</div>
                    <div className="text-sm opacity-80">Bow ties to Crowns</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleUpgrade}
                    className="bg-white text-black/90 hover:bg-gray-100 font-bold text-lg px-8 py-6"
                  >
                    Get 40 Portraits for $19 →
                  </Button>
                  <Link href="/">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      Maybe Later
                    </Button>
                  </Link>
                </div>

                <p className="text-sm mt-4 opacity-75">
                  ⭐ 4.8/5 rating • 💯 Money-back guarantee • 🚀 Instant delivery
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
