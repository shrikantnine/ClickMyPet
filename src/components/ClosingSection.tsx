'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPACING, ANIMATION } from '@/lib/utils'

// Showcase gallery images - Target distribution: 4 Dogs, 4 Cats, 1 Fish, 1 Horse (10 total) - evenly distributed
const showcaseImages = [
  { id: 1, src: '/Dog/Siberian Husky High FIve.png', alt: 'Siberian Husky High Five', title: 'Amazing Pet Photo 1' },
  { id: 2, src: '/Cat/Orange Cat Superhero Superman.png', alt: 'Orange Cat Superman', title: 'Amazing Pet Photo 2' },
  { id: 3, src: '/Dog/Boxer Gold Chain Glasses Hat Portrait.png', alt: 'Boxer Portrait', title: 'Amazing Pet Photo 3' },
  { id: 4, src: '/Cat/Scottish Fold Cat Tor Superhero.png', alt: 'Scottish Fold Superhero', title: 'Amazing Pet Photo 4' },
  { id: 5, src: '/Other/Molly Fish Portrait Aquarium 4.png', alt: 'Molly Fish Portrait', title: 'Amazing Pet Photo 5' },
  { id: 6, src: '/Dog/Pug Mugshot Funny.png', alt: 'Pug Mugshot', title: 'Amazing Pet Photo 6' },
  { id: 7, src: '/Cat/Maine Coon Cat Fire Fighter.png', alt: 'Maine Coon Fire Fighter', title: 'Amazing Pet Photo 7' },
  { id: 8, src: '/Dog/Boston Terrier Portrait Tie.png', alt: 'Boston Terrier Portrait', title: 'Amazing Pet Photo 8' },
  { id: 9, src: '/Cat/Abyssinian Cat Jump Fence.png', alt: 'Abyssinian Cat Jump', title: 'Amazing Pet Photo 9' },
  { id: 10, src: '/Other/Dutch Warmblood Horse Portrait.png', alt: 'Dutch Warmblood Horse', title: 'Amazing Pet Photo 10' },
]

export default function ClosingSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % showcaseImages.length)
      }, ANIMATION.IMAGE_TRANSITION * 1000)
    }

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    startAutoScroll()

    return () => stopAutoScroll()
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? showcaseImages.length - 1 : prev - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % showcaseImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section 
      className="bg-gradient-to-br from-blue-600 to-purple-700 text-white overflow-hidden w-screen h-[100vh] lg:h-[80vh] flex flex-col justify-center"
      style={{ paddingTop: SPACING.SECTION_GAP * 0.5, paddingBottom: SPACING.SECTION_GAP * 0.5 }}
    >
      <div className="container mx-auto px-4 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Make Your Pet Famous?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of happy pet parents and capture your pet's unique personality.
            </p>
          </div>

          {/* Scrollable Image Gallery - uniform image sizing */}
          <div className="relative flex flex-col items-center space-y-6">
            <div 
              className="relative rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                height: "50vh",
                width: "40vh",
                aspectRatio: "4/5"
              }}
            >
              {/* Image Carousel/Scroller */}
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full w-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {showcaseImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex-shrink-0 h-[50vh] w-[40vh] relative"
                    style={{
                      aspectRatio: "4/5",
                      height: "50vh",
                      width: "40vh"
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    {/* Partial third image on mobile (optional) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 md:hidden" />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 gap-2">
              {showcaseImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Button Section */}
        <div className="flex justify-center mt-8 pt-0">
          <Link href="/checkout">
            <Button 
              size="lg" 
              variant="gradient"
              className="font-bold px-8 py-4 text-lg"
            >
              Transform Your Pet Photos Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}