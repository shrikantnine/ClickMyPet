'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import Marquee from 'react-fast-marquee'
import { Button } from '@/components/ui/button'
import { SPACING } from '@/lib/utils'

// Pet photos organized by category for Hero Section
// Target distribution: 20 Dogs, 17 Cats, 4 Fish, 3 Birds, 2 Horses (46 total) - evenly distributed
const heroPhotos = [
  { src: '/Dog/Beagle Cool Portrait Glasses Hat.png', alt: 'Beagle Portrait', category: 'dog' },
  { src: '/Cat/Abyssinian Cat Spiderman Superhero.png', alt: 'Abyssinian Spiderman', category: 'cat' },
  { src: '/Dog/Bernese Mountain Dog Aniversary.png', alt: 'Bernese Mountain Dog', category: 'dog' },
  { src: '/Cat/Bengal Cat On Skateboard.png', alt: 'Bengal Skateboard', category: 'cat' },
  { src: '/Other/Betta Fish Portrait Aquarium 1.png', alt: 'Betta Fish', category: 'fish' },
  { src: '/Dog/Boxer Gold Chain Glasses Hat Portrait.png', alt: 'Boxer Portrait', category: 'dog' },
  { src: '/Cat/Birman Cat Portrait.png', alt: 'Birman Portrait', category: 'cat' },
  { src: '/Other/Parakeet Bird Portrait.png', alt: 'Parakeet', category: 'bird' },
  { src: '/Dog/Bulldog Gangster Chilling In Car.png', alt: 'Bulldog in Car', category: 'dog' },
  { src: '/Cat/Bombay Cat Sant Christmas Xmas.png', alt: 'Bombay Santa', category: 'cat' },
  { src: '/Dog/Cavalier King Charles Spaniel Superhero.png', alt: 'Cavalier Superhero', category: 'dog' },
  { src: '/Cat/British Shorthair Fire Fighter.png', alt: 'British Shorthair Firefighter', category: 'cat' },
  { src: '/Other/American Paint Horse Portrait.png', alt: 'Paint Horse', category: 'horse' },
  { src: '/Dog/Chihuahua Superhero.png', alt: 'Chihuahua Superhero', category: 'dog' },
  { src: '/Cat/Devon Rex Cat Royal Portrait.png', alt: 'Devon Rex Royal', category: 'cat' },
  { src: '/Other/Goldfish Portrait Aquarium 1.png', alt: 'Goldfish', category: 'fish' },
  { src: '/Dog/Dachshund High Five Excited.png', alt: 'Dachshund High Five', category: 'dog' },
  { src: '/Cat/Domestic Longhair Cat Batman Superhero.png', alt: 'Domestic Longhair Batman', category: 'cat' },
  { src: '/Dog/Doberman Pinscher Gold Chain Portrait.png', alt: 'Doberman Portrait', category: 'dog' },
  { src: '/Cat/Maine Coon Cat Royal Portrait.png', alt: 'Maine Coon Royal', category: 'cat' },
  { src: '/Other/Cockateil Bird Portrait.png', alt: 'Cockatiel', category: 'bird' },
  { src: '/Dog/French Bulldog Royal Portrait.png', alt: 'French Bulldog Royal', category: 'dog' },
  { src: '/Cat/Orange Cat Royal Portrait.png', alt: 'Orange Cat Royal', category: 'cat' },
  { src: '/Dog/German Shepherd Suite Portrait.png', alt: 'German Shepherd', category: 'dog' },
  { src: '/Cat/Oriental Shorthair Cat Portrait.png', alt: 'Oriental Shorthair', category: 'cat' },
  { src: '/Other/Neon Tetra Fish Portrait Aquarium.png', alt: 'Neon Tetra', category: 'fish' },
  { src: '/Dog/Golden Retriever Santa Xmas.png', alt: 'Golden Retriever Santa', category: 'dog' },
  { src: '/Cat/Persian Cat Superhero Superman.png', alt: 'Persian Superman', category: 'cat' },
  { src: '/Dog/Labrador Retriever Jump.png', alt: 'Labrador Jump', category: 'dog' },
  { src: '/Cat/Ragdoll Cat Aniversary.png', alt: 'Ragdoll Anniversary', category: 'cat' },
  { src: '/Other/Lovebird Portrait 1.png', alt: 'Lovebird', category: 'bird' },
  { src: '/Dog/Poodle Ex Royalty Portrait.png', alt: 'Poodle Royal', category: 'dog' },
  { src: '/Cat/Russian Blue Cat Batman.png', alt: 'Russian Blue Batman', category: 'cat' },
  { src: '/Dog/Pug Gold Chain Hat Glasses.png', alt: 'Pug Portrait', category: 'dog' },
  { src: '/Cat/Siamese Cat Gold Chain Hat Glasses.png', alt: 'Siamese Portrait', category: 'cat' },
  { src: '/Other/Siamese Fighting Fish Portrait Aquarium.png', alt: 'Siamese Fighting Fish', category: 'fish' },
  { src: '/Dog/Shiba Inu Portrait.png', alt: 'Shiba Inu', category: 'dog' },
  { src: '/Cat/Siberian Cat Royal Portrait.png', alt: 'Siberian Cat Royal', category: 'cat' },
  { src: '/Other/Thoroughbred Horse Portrait.png', alt: 'Thoroughbred Horse', category: 'horse' },
  { src: '/Dog/Shih Tzu Royal Portrait.png', alt: 'Shih Tzu Royal', category: 'dog' },
  { src: '/Cat/Sphynx Cat Portrait.png', alt: 'Sphynx Portrait', category: 'cat' },
  { src: '/Dog/Siberian Husky Royal Portrait.png', alt: 'Husky Royal', category: 'dog' },
  { src: '/Cat/Turkish Angora Chilling In Car.png', alt: 'Turkish Angora Car', category: 'cat' },
  { src: '/Dog/Yorkshire Terrier Batman.png', alt: 'Yorkshire Batman', category: 'dog' },
  { src: '/Dog/Rottweiler Halloween Funny.png', alt: 'Rottweiler Halloween', category: 'dog' },
  { src: '/Dog/Great Dane Portrait.png', alt: 'Great Dane', category: 'dog' },
]

const createMarqueeImages = (count: number, startIndex: number = 0) => 
  Array.from({ length: count }, (_, i) => {
    const photo = heroPhotos[(startIndex + i) % heroPhotos.length]
    return {
      id: i + 1,
      src: photo.src,
      alt: photo.alt
    }
  })

const heroImages = {
  row1: createMarqueeImages(15, 0),
  row2: createMarqueeImages(15, 15),
  row3: createMarqueeImages(15, 30),
}
export default function HeroSection() {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-white-100">
      <div className="absolute inset-0 flex flex-col w-full h-full gap-1">
        {/* Row 1 */}
        <div className="flex-1 w-full h-full">
          <Marquee
            speed={50}
            direction="left"
            gradient={false}
            className="h-full w-full flex items-center"
          >
            {heroImages.row1.map((image, index) => (
              <div
                key={`row1-${image.id}`}
                className="flex-shrink-0"
                style={{ margin: '0 0.5rem' }} // uniform small gap
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={250}
                  height={310}
                  loading={index < 3 ? "eager" : "lazy"}
                  priority={index < 3}
                  className="
                    rounded-sm
                    h-[31vh] 
                    w-[24.8vh] 
                    md:h-[31vh] 
                    md:w-[24.8vh]
                    object-cover
                    card-shadow
                  " // vh for height, width for 4:5 ratio
                />
              </div>
            ))}
          </Marquee>
        </div>
        {/* Row 2 */}
        <div className="flex-1 w-full h-full">
          <Marquee
            speed={50}
            direction="left"
            gradient={false}
            delay={-2}
            className="h-full w-full flex items-center"
          >
            {heroImages.row2.map((image) => (
              <div
                key={`row2-${image.id}`}
                className="flex-shrink-0"
                style={{ margin: '0 0.5rem' }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={250}
                  height={310}
                  loading="lazy"
                  className="
                    rounded-sm
                    h-[31vh] 
                    w-[24.8vh]
                    md:h-[31vh] 
                    md:w-[24.8vh]
                    object-cover
                    card-shadow
                  "
                />
              </div>
            ))}
          </Marquee>
        </div>
        {/* Row 3 */}
        <div className="flex-1 w-full h-full">
          <Marquee
            speed={50}
            direction="left"
            gradient={false}
            delay={-4}
            className="h-full w-full flex items-center"
          >
            {heroImages.row3.map((image) => (
              <div
                key={`row3-${image.id}`}
                className="flex-shrink-0"
                style={{ margin: '0 0.5rem' }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={250}
                  height={310}
                  loading="lazy"
                  className="
                    rounded-sm
                    h-[31vh] 
                    w-[24.8vh]
                    md:h-[31vh] 
                    md:w-[24.8vh]
                    object-cover
                    card-shadow
                  "
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Glass Morphism Text Box */}
      <div className="relative z-10 container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-6 shadow-lg md:max-w-lg mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-black/95 text-center">
            Transform Your Pet Photos into Amazing Portraits
          </h1>
          <p className="mt-4 text-lg text-black/90 text-center text-justify">
            Instantly generate an album of portraits with unique styles and fun accessories
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/onboarding">
              <Button
                variant="moody-fill"
                size="lg"
                className="w-full md:w-auto text-lg px-8 py-6 font-bold"
              >
                Create Your Pet Portraits Now
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="flex">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            </div>
            <span className="text-sm text-gray-900 text-center">
              4.8/5 (1,250+ Happy Pet Parents)
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}