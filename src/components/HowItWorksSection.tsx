'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SPACING } from '@/lib/utils'

// Using showcase-quality images - 1 Dog, 1 Cat, 1 Fish (3 total)
const steps = [
  {
    number: '01',
    title: 'Select Customisation',
    description: 'Choose from 15+ artistic styles, 25+ backgrounds, and fun accessories to personalize your pet\'s portrait',
    image: '/Dog/Labrador Retriever Water Play.png'
  },
  {
    number: '02',
    title: 'Upload Pet Photos',
    description: 'Select 5 high-quality photos of your pet to generate the best possible results',
    image: '/Cat/Persian Cat Superhero Superman.png'
  },
  {
    number: '03',
    title: 'Download in Seconds',
    description: 'Get professional AI-generated pet photos ready to share. Download as ZIP with all your creations!',
    image: '/Other/Goldfish Portrait Aquarium 2.png'
  }
]

export default function HowItWorksSection() {
  return (
    <section 
      id="how-it-works" 
      className="bg-white"
      style={{ paddingTop: SPACING.SECTION_GAP * 8, paddingBottom: SPACING.SECTION_GAP * 8 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started in 3 Easy Steps
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            Transform your pet photos into stunning portraits in just seconds. Our AI does all the heavy lifting!
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Image */}
              <div className="relative aspect-[4/5] mb-6 rounded-sm overflow-hidden card-shadow-hover transition-shadow duration-300">
                <Image
                  src={step.image}
                  alt={step.title}
                  width={400}
                  height={500}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105 object-cover block"
                />
                {/* Step Number Overlay */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Step Content */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/onboarding">
            <Button variant="moody-fill" size="lg" className="px-8">
              Start Creating Amazing Pet Photos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}