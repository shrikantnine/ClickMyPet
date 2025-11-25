'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn, SPACING } from '@/lib/utils'

const faqs = [
  {
    question: 'How does Click My Pet work?',
    answer: 'Our advanced AI analyzes your pet photos and creates professional headshots using state-of-the-art machine learning. Simply upload a clear picture of your pet, choose your preferred style and background, and our AI will generate stunning portraits in minutes.'
  },
  {
    question: 'What types of pets are supported?',
    answer: 'Click My Pet works with all types of pets including dogs, cats, rabbits, birds, and more! Our AI has been trained on a diverse dataset of animals to ensure great results regardless of your pet\'s breed, size, or color.'
  },
  {
    question: 'How long does it take to get the photos?',
    answer: 'Most photo generations are completed within 2-3 minutes. You\'ll receive an email notification once your AI pet photos are ready for download. During peak times, it may take up to 5 minutes.'
  },
  {
    question: 'What photo quality should I upload for best results?',
    answer: 'For optimal results, upload high-resolution photos (at least 1024x1024 pixels) with good lighting. Make sure your pet\'s face is clearly visible and not blurry. Avoid photos with heavy filters or extreme angles.'
  },
  {
    question: 'Can I get a refund if I\'m not satisfied?',
    answer: 'Absolutely! We offer Refunds without any questions asked. If you\'re not satisfied with your AI-generated pet photos, contact our support team and we\'ll process a partial or full refund based on the case. We want you to be happy with your results!'
  },
  {
    question: 'Do I own the rights to the generated photos?',
    answer: 'Yes! Once you purchase a plan, you own full rights to your generated pet photos. You can use them for personal purposes, social media, gifts, or even commercial use (with Max plan). We don\'t store or use your photos for any other purpose.'
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-4">
          <p className="text-gray-800 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <section 
      id="faq" 
      className="bg-gray-50"
      style={{ paddingTop: SPACING.SECTION_GAP * 8, paddingBottom: SPACING.SECTION_GAP * 8 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, 
            feel free to reach out to our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}