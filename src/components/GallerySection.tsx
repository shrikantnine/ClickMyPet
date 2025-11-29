'use client'

import Link from 'next/link'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { Button } from '@/components/ui/button'
import { SPACING } from '@/lib/utils'

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
      className="w-screen h-[140vh] bg-gray-50 overflow-hidden flex flex-col"
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
      <div className="flex-1 w-full h-full overflow-hidden flex flex-col gap-2">
        {galleryRows.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="flex-1 w-full h-full"
          >
            <Marquee
              speed={42}
              direction="left"
              gradient={false}
              // Apply negative delay for row 2 and row 3 as per rule
              delay={rowIndex === 1 ? -2 : rowIndex === 2 ? -4 : 0}
              className="h-full w-full flex items-center"
            >
              {row.map((image) => (
                <div
                  key={image.id}
                  className="flex-shrink-0"
                  style={{ margin: '0 0.3rem' }} // uniform small horizontal gap
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={250}
                    height={310}
                    loading="lazy"
                    className="
                      rounded-sm shadow-sm hover:shadow-xl transition-shadow duration-300
                      h-[31vh] w-[24.8vh]
                      md:h-[31vh] md:w-[24.8vh]
                      object-cover
                    "
                  />
                </div>
              ))}
            </Marquee>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="container mx-auto px-4 py-8 text-center flex-shrink-0">
        <Link href="/checkout">
          <Button variant="gradient" size="lg" className="px-8">
            Create Your Pet Gallery Now
          </Button>
        </Link>
      </div>
    </section>
  )
}