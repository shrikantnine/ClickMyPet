'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  generationId: string
}

const IMPROVEMENT_OPTIONS = [
  'Image quality could be better',
  'Style accuracy needs improvement',
  'Background doesn\'t match my selection',
  'Accessories placement is off',
  'Colors look unnatural',
]

export default function RatingModal({ isOpen, onClose, userId, generationId }: RatingModalProps) {
  const [step, setStep] = useState<'rating' | 'feedback' | 'review' | 'complete'>('rating')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([])
  const [customFeedback, setCustomFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleRatingClick = async (stars: number) => {
    setRating(stars)

    // If 5 stars, show review request
    if (stars === 5) {
      setStep('review')
    } 
    // If less than 4 stars, ask for feedback
    else if (stars < 4) {
      setStep('feedback')
    }
    // If 4 stars, just thank them
    else {
      await submitRating(stars, [], '')
      setStep('complete')
    }
  }

  const toggleImprovement = (improvement: string) => {
    setSelectedImprovements(prev =>
      prev.includes(improvement)
        ? prev.filter(i => i !== improvement)
        : [...prev, improvement]
    )
  }

  const submitRating = async (
    stars: number,
    improvements: string[],
    feedback: string
  ) => {
    setSubmitting(true)

    try {
      // Save rating to database
      const { error } = await supabase
        .from('ratings')
        .insert({
          user_id: userId,
          generation_id: generationId,
          rating: stars,
          improvement_areas: improvements,
          feedback: feedback,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Thank you for your feedback!')
    } catch (error) {
      console.error('Failed to submit rating:', error)
      toast.error('Failed to submit rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFeedbackSubmit = async () => {
    await submitRating(rating, selectedImprovements, customFeedback)
    toast.success('Thank you! We\'ll use your feedback to improve.')
    onClose()
  }

  const handleReviewLater = async () => {
    await submitRating(rating, [], '')
    toast.success('Thank you for your rating!')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Rating Step */}
        {step === 'rating' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">How do you like your portraits?</h2>
            <p className="text-gray-600">
              Your feedback helps us improve Click My Pet
            </p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {hoveredRating || rating
                ? hoveredRating || rating === 1
                  ? 'Poor'
                  : hoveredRating || rating === 2
                  ? 'Fair'
                  : hoveredRating || rating === 3
                  ? 'Good'
                  : hoveredRating || rating === 4
                  ? 'Very Good'
                  : 'Excellent!'
                : 'Click a star to rate'}
            </p>
          </div>
        )}

        {/* Feedback Step (for ratings < 4) */}
        {step === 'feedback' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Help us improve!</h2>
              <p className="text-gray-600">
                What could we do better? Select all that apply:
              </p>
            </div>

            {/* Improvement Options */}
            <div className="space-y-2">
              {IMPROVEMENT_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleImprovement(option)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition ${
                    selectedImprovements.includes(option)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Custom Feedback */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional feedback (optional)
              </label>
              <textarea
                value={customFeedback}
                onChange={(e) => setCustomFeedback(e.target.value)}
                placeholder="Tell us more about your experience..."
                className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleFeedbackSubmit}
              disabled={submitting || selectedImprovements.length === 0}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        )}

        {/* Review Request Step (for 5 stars) */}
        {step === 'review' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">
                We're thrilled you loved it! ⭐
              </h2>
              <p className="text-gray-600">
                Would you mind sharing your experience on Trustpilot? 
                It helps other pet owners discover Click My Pet!
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  window.open(
                    'https://www.trustpilot.com/review/clickmypet.com',
                    '_blank'
                  )
                  submitRating(rating, [], '')
                  onClose()
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Leave a Review on Trustpilot
              </Button>

              <Button
                onClick={handleReviewLater}
                variant="outline"
                className="w-full"
              >
                Maybe Later
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Your review helps us grow and improve our service
            </p>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold">Thank you!</h2>
            <p className="text-gray-600">
              Your feedback helps us create better portraits for all pet owners.
            </p>

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
