'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SPACING } from '@/lib/utils'

function AutoScrollRow({
  images,
  speedPxPerSecond,
  direction,
  delaySeconds = 0,
}: {
  images: Array<{ id: string; src: string; alt: string }>
  speedPxPerSecond: number
  direction: 'left' | 'right'
  delaySeconds?: number
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const doubledImages = useMemo(() => [...images, ...images], [images])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const halfWidth = () => scroller.scrollWidth / 2

    // If scrolling to the right, start in the middle so there's content to the left.
    if (direction === 'right') {
      scroller.scrollLeft = halfWidth()
    }

    let isCancelled = false

    const startAt = performance.now() + delaySeconds * 1000

    const step = (now: number) => {
      if (isCancelled) return

      if (now < startAt) {
        rafIdRef.current = requestAnimationFrame(step)
        return
      }

      const last = lastTimeRef.current ?? now
      const dtMs = now - last
      lastTimeRef.current = now

      const delta = (speedPxPerSecond * dtMs) / 1000
      const dir = direction === 'left' ? 1 : -1
      scroller.scrollLeft += dir * delta

      const hw = halfWidth()
      if (hw > 0) {
        if (direction === 'left' && scroller.scrollLeft >= hw) {
          scroller.scrollLeft -= hw
        } else if (direction === 'right' && scroller.scrollLeft <= 0) {
          scroller.scrollLeft += hw
        }
      }

      rafIdRef.current = requestAnimationFrame(step)
    }

    rafIdRef.current = requestAnimationFrame(step)

    return () => {
      isCancelled = true
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      lastTimeRef.current = null
    }
  }, [direction, delaySeconds, speedPxPerSecond, doubledImages.length])

  return (
    <div
      ref={scrollerRef}
      className="h-full w-full overflow-x-auto overflow-y-hidden leading-none hide-scrollbar"
    >
      <div className="flex h-full items-center w-max">
        {doubledImages.map((image, idx) => (
          <div
            // Ensure uniqueness even when duplicated
            key={`${image.id}-${idx}`}
            className="flex-shrink-0 h-full flex items-center"
            style={{ margin: '0 0.3rem' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={250}
              height={310}
              loading="lazy"
              className="
                rounded-sm card-shadow-hover-only
                h-[31vh] w-[24.8vh]
                md:h-[31vh] md:w-[24.8vh]
                object-cover
                block
              "
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Gallery photos - Target distribution: 16 Dogs, 14 Cats, 3 Fish, 2 Birds, 1 Horse (36 total) - evenly distributed
const galleryPhotos = [
  { src: '/Dog/Beagle Jumping Frisbee.png', alt: 'Beagle Frisbee' },
  { src: '/Cat/Abyssinian Cat Jump.png', alt: 'Abyssinian Jump' },
  { src: '/Dog/Bernese Mountain Dog Vacation Beach.png', alt: 'Bernese Beach' },
  { src: '/Cat/Bengal Cat Mugshot.png', alt: 'Bengal Mugshot' },
  { src: '/Other/Betta Fish Portrait Aquarium 2.png', alt: 'Betta Fish' },
  { src: '/Dog/Boston Terrier Water Play.png', alt: 'Boston Terrier Water' },
  { src: '/Cat/Birman Cat Gold Chain Hat Glasses.png', alt: 'Birman Portrait' },
  { src: '/Dog/Cane Corso Aniversary.png', alt: 'Cane Corso Anniversary' },
  { src: '/Cat/Bombay Cat Chilling In Car.png', alt: 'Bombay Car' },
  { src: '/Other/Canary Bird Portrait.png', alt: 'Canary' },
  { src: '/Dog/Cavalier King Charles Spaniel Christmas Santa Gifts.png', alt: 'Cavalier Santa' },
  { src: '/Cat/Burmese Cat Mugshot.png', alt: 'Burmese Mugshot' },
  { src: '/Dog/Chihuahua Gold Chain Hat Glasses.png', alt: 'Chihuahua Portrait' },
  { src: '/Cat/Devon Rex Cat Gold Chain Hat Glasses.png', alt: 'Devon Rex Portrait' },
  { src: '/Other/Molly Fish Portrait Aquarium 1.png', alt: 'Molly Fish' },
  { src: '/Dog/Dachshund Portrait Suite.png', alt: 'Dachshund Suite' },
  { src: '/Cat/Domestic Shorthair Cat Curious.png', alt: 'Domestic Shorthair Curious' },
  { src: '/Dog/English Setter Vacation Beach Glasses Lawnchair.png', alt: 'English Setter Beach' },
  { src: '/Cat/European Shorthair Vacation Chilling On Beach.png', alt: 'European Shorthair Beach' },
  { src: '/Other/Dutch Warmblood Horse Portrait.png', alt: 'Dutch Warmblood' },
  { src: '/Dog/French Bulldog Beach Vacation Hawaiian Attire.png', alt: 'French Bulldog Hawaiian' },
  { src: '/Cat/Mogie Cat Santa Xmas Christmas.png', alt: 'Mogie Santa' },
  { src: '/Dog/German Spitz Jump.png', alt: 'German Spitz Jump' },
  { src: '/Cat/Norwagian Forest Cat Climbing Tree.png', alt: 'Norwegian Forest Climbing' },
  { src: '/Other/Bugie Bird Portrait.png', alt: 'Budgie' },
  { src: '/Dog/Goldern Retriever Superman Superhero.png', alt: 'Golden Retriever Superman' },
  { src: '/Cat/Orange Cat Looking Out Of Window.png', alt: 'Orange Cat Window' },
  { src: '/Dog/Maltese Gold Chain Hat Glasses.png', alt: 'Maltese Portrait' },
  { src: '/Cat/Persian Cat Chilling On Beach Vacation.png', alt: 'Persian Beach' },
  { src: '/Other/Swordtail Fish Portrait Aquarium 2.png', alt: 'Swordtail Fish' },
  { src: '/Dog/Poodle Cab Driver.png', alt: 'Poodle Cab Driver' },
  { src: '/Cat/Savannah Cat Starting Out Of Window.png', alt: 'Savannah Window' },
  { src: '/Dog/Pug Skateboard Portrait.png', alt: 'Pug Skateboard' },
  { src: '/Cat/Siberian Cat Joker.png', alt: 'Siberian Joker' },
  { src: '/Dog/Siberian Husky Superhero.png', alt: 'Husky Superhero' },
  { src: '/Dog/Yorkshire Terrier Superhero.png', alt: 'Yorkshire Superhero' },
]

const createGalleryRow = (rowIndex: number) => 
  Array.from({ length: 12 }, (_, i) => {
    const photoIndex = (rowIndex * 12 + i) % galleryPhotos.length
    const photo = galleryPhotos[photoIndex]
    return {
      id: `row${rowIndex}-${i + 1}`,
      ...photo
    }
  })

const galleryRows = Array.from({ length: 3 }, (_, i) => createGalleryRow(i + 1))

export default function GallerySection() {
  return (
    <section 
      id="gallery"
      className="w-screen h-auto md:h-[140vh] bg-gray-50 overflow-hidden flex flex-col"
    >
      <div className="container mx-auto px-4 py-8 flex-shrink-0">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Amazing Results
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            See what other pet parents have created with Click My Pet. Your furry friend could be next!
          </p>
        </div>
      </div>

      {/* Gallery Marquee Rows */}
      <div className="flex-1 w-full overflow-hidden flex flex-col gap-4">
        {galleryRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="w-full flex-none h-[31vh]"
          >
            <AutoScrollRow
              images={row}
              speedPxPerSecond={42}
              direction="left"
              delaySeconds={rowIndex === 1 ? 2 : rowIndex === 2 ? 4 : 0}
            />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="container mx-auto px-4 py-8 text-center flex-shrink-0">
        <Link href="/checkout">
          <Button variant="moody-fill" size="lg" className="px-8">
            Create Your Pet Gallery Now
          </Button>
        </Link>
      </div>
    </section>
  )
}