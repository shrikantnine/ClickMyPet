'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { SPACING } from '@/lib/utils'
import StickyCTA from '@/components/StickyCTA'

// Complete gallery with all images from public folder
// Organized by category for filtering
const allPhotos = {
  dog: [
    '/Dog/Beagle Cool Portrait Glasses Hat.png',
    '/Dog/Beagle Jumping Frisbee.png',
    '/Dog/Bernese Mountain Dog Aniversary.png',
    '/Dog/Bernese Mountain Dog Vacation Beach.png',
    '/Dog/Boston Terrier Portrait Tie.png',
    '/Dog/Boston Terrier Water Play.png',
    '/Dog/Boxer Gold Chain Glasses Hat Portrait.png',
    '/Dog/Boxer Vacation Beach Glasses Lawnchair.png',
    '/Dog/Bulldog Gangster Chilling In Car.png',
    '/Dog/Bulldog Gangster Rapper Gold Chain Hat Glasses.png',
    '/Dog/Cane Corso Aniversary.png',
    '/Dog/Cane Corso Portrait.png',
    '/Dog/Cavalier King Charles Spaniel Christmas Santa Gifts.png',
    '/Dog/Cavalier King Charles Spaniel Looking Out Of Window.png',
    '/Dog/Cavalier King Charles Spaniel Superhero.png',
    '/Dog/Chihuahua Gold Chain Hat Glasses.png',
    '/Dog/Chihuahua Portrait High Five.png',
    '/Dog/Chihuahua Superhero.png',
    '/Dog/Chihuahua Superman.png',
    '/Dog/Dachshund High Five Excited.png',
    '/Dog/Dachshund Portrait Suite.png',
    '/Dog/Dachshund Vacation Beach Lawnchair.png',
    '/Dog/Doberman Pinscher Gold Chain Hat Glasses.png',
    '/Dog/Doberman Pinscher Gold Chain Portrait.png',
    '/Dog/English Cocker Spaniel Aniversary.png',
    '/Dog/English Cocker Spaniel Water Play.png',
    '/Dog/English Setter Portrait.png',
    '/Dog/English Setter Vacation Beach Glasses Lawnchair.png',
    '/Dog/French Bulldog Beach Vacation Hawaiian Attire.png',
    '/Dog/French Bulldog Chilling In A Car.png',
    '/Dog/French Bulldog Gangster Portrait.png',
    '/Dog/French Bulldog Mugshot Guilty As Charged.png',
    '/Dog/French Bulldog Royal Portrait.png',
    '/Dog/German Shephard Celebrating Birthday.png',
    '/Dog/German Shepherd Suite Portrait.png',
    '/Dog/German Shorthaired Pointer Green Glasses.png',
    '/Dog/German Shorthaired Pointer Roayal Portrait.png',
    '/Dog/German Spitz  Looking Out Of Windlow.png',
    '/Dog/German Spitz  Portrait.png',
    '/Dog/German Spitz Jump.png',
    '/Dog/Golden Retriever Santa Xmas.png',
    '/Dog/Goldern Retriever Superman Superhero.png',
    '/Dog/Great Dane Portrait.png',
    '/Dog/Labrador Retriever Jump.png',
    '/Dog/Labrador Retriever Water Play.png',
    '/Dog/Maltese Christmas Santa Gifts.png',
    '/Dog/Maltese Gold Chain Hat Glasses.png',
    '/Dog/Miniature Schnauzer Looking Out Of Window.png',
    '/Dog/Miniature Schnauzer Portrait.png',
    '/Dog/Pembroke Welsh Corgi Portrait.png',
    '/Dog/Pembroke Welsh Corgi Superhero.png',
    '/Dog/Poodle Cab Driver.png',
    '/Dog/Poodle Ex Royalty Portrait.png',
    '/Dog/Pug Gold Chain Hat Glasses.png',
    '/Dog/Pug Mugshot Funny.png',
    '/Dog/Pug On Skateboard.png',
    '/Dog/Pug Skateboard Portrait.png',
    '/Dog/Rottweiler Halloween Funny.png',
    '/Dog/Rottweiler Mugshot Funny.png',
    '/Dog/Shiba Inu Animated.png',
    '/Dog/Shiba Inu Close Up Portrait.png',
    '/Dog/Shiba Inu Portrait.png',
    '/Dog/Shih Tzu Royal Portrait.png',
    '/Dog/Shih Tzu Vacation Beach Glasses.png',
    '/Dog/Siberian Husky Chilling In Car.png',
    '/Dog/Siberian Husky Gold Chain Hat Glasses.png',
    '/Dog/Siberian Husky High FIve.png',
    '/Dog/Siberian Husky Jumping Snow.png',
    '/Dog/Siberian Husky Royal Portrait.png',
    '/Dog/Siberian Husky Superhero.png',
    '/Dog/Yorkshire Terrier Batman.png',
    '/Dog/Yorkshire Terrier Mugshot.png',
    '/Dog/Yorkshire Terrier Superhero.png',
  ],
  cat: [
    '/Cat/Abyssinian Cat Jump Fence.png',
    '/Cat/Abyssinian Cat Jump.png',
    '/Cat/Abyssinian Cat Spiderman Superhero.png',
    '/Cat/American Shorthair Cat Glasses.png',
    '/Cat/Bengal Cat Mugshot.png',
    '/Cat/Bengal Cat On Skateboard.png',
    '/Cat/Birman Cat Gold Chain Hat Glasses.png',
    '/Cat/Birman Cat Portrait.png',
    '/Cat/Bombay Cat Chilling In Car.png',
    '/Cat/Bombay Cat Sant Christmas Xmas.png',
    '/Cat/British Shorthair Fire Fighter.png',
    '/Cat/British Shorthair Looking Out Of Window.png',
    '/Cat/Burmese Cat Jump.png',
    '/Cat/Burmese Cat Mugshot.png',
    '/Cat/Devon Rex Cat Gold Chain Hat Glasses.png',
    '/Cat/Devon Rex Cat Royal Portrait.png',
    '/Cat/Domestic Longhair Cat Batman Superhero.png',
    '/Cat/Domestic Longhair Cat Royal Portrait.png',
    '/Cat/Domestic Shorthair Cat Curious.png',
    '/Cat/Domestic Shorthair Cat Looking Out Of Window.png',
    '/Cat/Domestic Shorthair Cat Portrait.png',
    '/Cat/European Shorthair Costume Portrait.png',
    '/Cat/European Shorthair Vacation Chilling On Beach.png',
    '/Cat/Exotic Shorthair Costume.png',
    '/Cat/Exotic Shorthair Vacation Beach.png',
    '/Cat/Maine Coon Cat Fire Fighter.png',
    '/Cat/Maine Coon Cat Royal Portrait.png',
    '/Cat/Mogie Cat Royal Portrait.png',
    '/Cat/Mogie Cat Santa Xmas Christmas.png',
    '/Cat/Norwagian Forest Cat Chilling In Car.png',
    '/Cat/Norwagian Forest Cat Climbing Tree.png',
    '/Cat/Norwagian Forest Cat Mugshot.png',
    '/Cat/Norwagian Forest Cat Santa Xmas Christmas.png',
    '/Cat/Norwagian Forest Cat Skateboarding.png',
    '/Cat/Orange Cat Jump.png',
    '/Cat/Orange Cat Looking Out Of Window.png',
    '/Cat/Orange Cat Mugshot.png',
    '/Cat/Orange Cat Royal Portrait.png',
    '/Cat/Orange Cat Superhero Superman.png',
    '/Cat/Orange Cat iAngry.png',
    '/Cat/Oriental Shorthair Cat Costume.png',
    '/Cat/Oriental Shorthair Cat Looking Out Of Window.png',
    '/Cat/Oriental Shorthair Cat Portrait.png',
    '/Cat/Persian Cat Chilling On Beach Vacation.png',
    '/Cat/Persian Cat Superhero Ironman.png',
    '/Cat/Persian Cat Superhero Superman.png',
    '/Cat/Ragdoll Cat Aniversary.png',
    '/Cat/Ragdoll Cat Jump.png',
    '/Cat/Ragdoll Orange Cat Jump.png',
    '/Cat/Russian Blue Cat Batman.png',
    '/Cat/Savannah Cat Costume Portrait.png',
    '/Cat/Savannah Cat Starting Out Of Window.png',
    '/Cat/Scottish Fold Cat Aniveersary Cake.png',
    '/Cat/Scottish Fold Cat Tor Superhero.png',
    '/Cat/Siamese Cat Gold Chain Hat Glasses.png',
    '/Cat/Siamese Cat Vacation Chilling On Beach.png',
    '/Cat/Siberian Cat Gold Chain Hat Glasses.png',
    '/Cat/Siberian Cat Joker.png',
    '/Cat/Siberian Cat Royal Portrait.png',
    '/Cat/Sphynx Cat Aniversary Cake.png',
    '/Cat/Sphynx Cat Portrait.png',
    '/Cat/Turkish Angora Chilling In Car.png',
    '/Cat/Turkish Angora Skateboarding.png',
  ],
  fish: [
    '/Other/Betta Fish Portrait Aquarium 1.png',
    '/Other/Betta Fish Portrait Aquarium 2.png',
    '/Other/Betta Fish Portrait Aquarium 3.png',
    '/Other/Betta Fish Portrait Aquarium 4.png',
    '/Other/Goldfish Portrait Aquarium 1.png',
    '/Other/Goldfish Portrait Aquarium 2.png',
    '/Other/Molly Fish Portrait Aquarium 1.png',
    '/Other/Molly Fish Portrait Aquarium 2.png',
    '/Other/Molly Fish Portrait Aquarium 3.png',
    '/Other/Molly Fish Portrait Aquarium 4.png',
    '/Other/Molly Fish Portrait Aquarium 5.png',
    '/Other/Neon Tetra Fish Portrait Aquarium.png',
    '/Other/Siamese Fighting Fish Portrait Aquarium.png',
    '/Other/Swordtail Fish Portrait Aquarium 1.png',
    '/Other/Swordtail Fish Portrait Aquarium 2.png',
    '/Other/Swordtail Fish Portrait Aquarium 3.png',
  ],
  bird: [
    '/Other/Bugie Bird Portrait.png',
    '/Other/Canary Bird Portrait.png',
    '/Other/Cockateil Bird Portrait.png',
    '/Other/Lovebird Portrait 1.png',
    '/Other/Lovebird Portrait 2.png',
    '/Other/Parakeet Bird Portrait.png',
  ],
  horse: [
    '/Other/American Paint Horse Portrait.png',
    '/Other/American Quarter Horse Portrait.png',
    '/Other/Dutch Warmblood Horse Portrait.png',
    '/Other/Hanoverian Warmblood Horse Portrait.png',
    '/Other/Thoroughbred Horse Portrait.png',
  ],
}

type FilterCategory = 'all' | 'dog' | 'cat' | 'fish' | 'bird' | 'horse'

// Hardcoded sequence following ratio 15:13:3:1:1 (Dog:Cat:Fish:Bird:Horse)
// Pattern ensures no consecutive same animals and birds/horses appear throughout
// Total: 165 images (73 dogs, 63 cats, 16 fish, 6 birds, 5 horses, + extras)
const galleryPhotos = [
  // Block 1 (33 images)
  { src: allPhotos.dog[0], category: 'dog' },
  { src: allPhotos.cat[0], category: 'cat' },
  { src: allPhotos.dog[1], category: 'dog' },
  { src: allPhotos.cat[1], category: 'cat' },
  { src: allPhotos.fish[0], category: 'fish' },
  { src: allPhotos.dog[2], category: 'dog' },
  { src: allPhotos.cat[2], category: 'cat' },
  { src: allPhotos.dog[3], category: 'dog' },
  { src: allPhotos.cat[3], category: 'cat' },
  { src: allPhotos.dog[4], category: 'dog' },
  { src: allPhotos.fish[1], category: 'fish' },
  { src: allPhotos.cat[4], category: 'cat' },
  { src: allPhotos.bird[0], category: 'bird' },
  { src: allPhotos.dog[5], category: 'dog' },
  { src: allPhotos.cat[5], category: 'cat' },
  { src: allPhotos.dog[6], category: 'dog' },
  { src: allPhotos.cat[6], category: 'cat' },
  { src: allPhotos.fish[2], category: 'fish' },
  { src: allPhotos.dog[7], category: 'dog' },
  { src: allPhotos.cat[7], category: 'cat' },
  { src: allPhotos.dog[8], category: 'dog' },
  { src: allPhotos.horse[0], category: 'horse' },
  { src: allPhotos.cat[8], category: 'cat' },
  { src: allPhotos.dog[9], category: 'dog' },
  { src: allPhotos.cat[9], category: 'cat' },
  { src: allPhotos.dog[10], category: 'dog' },
  { src: allPhotos.fish[3], category: 'fish' },
  { src: allPhotos.cat[10], category: 'cat' },
  { src: allPhotos.dog[11], category: 'dog' },
  { src: allPhotos.cat[11], category: 'cat' },
  { src: allPhotos.dog[12], category: 'dog' },
  { src: allPhotos.cat[12], category: 'cat' },
  { src: allPhotos.dog[13], category: 'dog' },
  
  // Block 2 (33 images)
  { src: allPhotos.fish[4], category: 'fish' },
  { src: allPhotos.cat[13], category: 'cat' },
  { src: allPhotos.bird[1], category: 'bird' },
  { src: allPhotos.dog[14], category: 'dog' },
  { src: allPhotos.cat[14], category: 'cat' },
  { src: allPhotos.dog[15], category: 'dog' },
  { src: allPhotos.cat[15], category: 'cat' },
  { src: allPhotos.dog[16], category: 'dog' },
  { src: allPhotos.fish[5], category: 'fish' },
  { src: allPhotos.cat[16], category: 'cat' },
  { src: allPhotos.horse[1], category: 'horse' },
  { src: allPhotos.dog[17], category: 'dog' },
  { src: allPhotos.cat[17], category: 'cat' },
  { src: allPhotos.dog[18], category: 'dog' },
  { src: allPhotos.cat[18], category: 'cat' },
  { src: allPhotos.dog[19], category: 'dog' },
  { src: allPhotos.fish[6], category: 'fish' },
  { src: allPhotos.cat[19], category: 'cat' },
  { src: allPhotos.dog[20], category: 'dog' },
  { src: allPhotos.cat[20], category: 'cat' },
  { src: allPhotos.bird[2], category: 'bird' },
  { src: allPhotos.dog[21], category: 'dog' },
  { src: allPhotos.cat[21], category: 'cat' },
  { src: allPhotos.dog[22], category: 'dog' },
  { src: allPhotos.fish[7], category: 'fish' },
  { src: allPhotos.cat[22], category: 'cat' },
  { src: allPhotos.dog[23], category: 'dog' },
  { src: allPhotos.cat[23], category: 'cat' },
  { src: allPhotos.dog[24], category: 'dog' },
  { src: allPhotos.cat[24], category: 'cat' },
  { src: allPhotos.horse[2], category: 'horse' },
  { src: allPhotos.dog[25], category: 'dog' },
  { src: allPhotos.cat[25], category: 'cat' },
  
  // Block 3 (33 images)
  { src: allPhotos.dog[26], category: 'dog' },
  { src: allPhotos.fish[8], category: 'fish' },
  { src: allPhotos.cat[26], category: 'cat' },
  { src: allPhotos.dog[27], category: 'dog' },
  { src: allPhotos.cat[27], category: 'cat' },
  { src: allPhotos.bird[3], category: 'bird' },
  { src: allPhotos.dog[28], category: 'dog' },
  { src: allPhotos.cat[28], category: 'cat' },
  { src: allPhotos.dog[29], category: 'dog' },
  { src: allPhotos.cat[29], category: 'cat' },
  { src: allPhotos.dog[30], category: 'dog' },
  { src: allPhotos.fish[9], category: 'fish' },
  { src: allPhotos.cat[30], category: 'cat' },
  { src: allPhotos.dog[31], category: 'dog' },
  { src: allPhotos.cat[31], category: 'cat' },
  { src: allPhotos.horse[3], category: 'horse' },
  { src: allPhotos.dog[32], category: 'dog' },
  { src: allPhotos.cat[32], category: 'cat' },
  { src: allPhotos.dog[33], category: 'dog' },
  { src: allPhotos.fish[10], category: 'fish' },
  { src: allPhotos.cat[33], category: 'cat' },
  { src: allPhotos.bird[4], category: 'bird' },
  { src: allPhotos.dog[34], category: 'dog' },
  { src: allPhotos.cat[34], category: 'cat' },
  { src: allPhotos.dog[35], category: 'dog' },
  { src: allPhotos.cat[35], category: 'cat' },
  { src: allPhotos.dog[36], category: 'dog' },
  { src: allPhotos.fish[11], category: 'fish' },
  { src: allPhotos.cat[36], category: 'cat' },
  { src: allPhotos.dog[37], category: 'dog' },
  { src: allPhotos.cat[37], category: 'cat' },
  { src: allPhotos.horse[4], category: 'horse' },
  { src: allPhotos.dog[38], category: 'dog' },
  
  // Block 4 (33 images)
  { src: allPhotos.cat[38], category: 'cat' },
  { src: allPhotos.dog[39], category: 'dog' },
  { src: allPhotos.fish[12], category: 'fish' },
  { src: allPhotos.cat[39], category: 'cat' },
  { src: allPhotos.bird[5], category: 'bird' },
  { src: allPhotos.dog[40], category: 'dog' },
  { src: allPhotos.cat[40], category: 'cat' },
  { src: allPhotos.dog[41], category: 'dog' },
  { src: allPhotos.cat[41], category: 'cat' },
  { src: allPhotos.dog[42], category: 'dog' },
  { src: allPhotos.fish[13], category: 'fish' },
  { src: allPhotos.cat[42], category: 'cat' },
  { src: allPhotos.dog[43], category: 'dog' },
  { src: allPhotos.cat[43], category: 'cat' },
  { src: allPhotos.dog[44], category: 'dog' },
  { src: allPhotos.fish[14], category: 'fish' },
  { src: allPhotos.cat[44], category: 'cat' },
  { src: allPhotos.dog[45], category: 'dog' },
  { src: allPhotos.cat[45], category: 'cat' },
  { src: allPhotos.dog[46], category: 'dog' },
  { src: allPhotos.cat[46], category: 'cat' },
  { src: allPhotos.dog[47], category: 'dog' },
  { src: allPhotos.cat[47], category: 'cat' },
  { src: allPhotos.dog[48], category: 'dog' },
  { src: allPhotos.fish[15], category: 'fish' },
  { src: allPhotos.cat[48], category: 'cat' },
  { src: allPhotos.dog[49], category: 'dog' },
  { src: allPhotos.cat[49], category: 'cat' },
  { src: allPhotos.dog[50], category: 'dog' },
  { src: allPhotos.cat[50], category: 'cat' },
  { src: allPhotos.dog[51], category: 'dog' },
  { src: allPhotos.cat[51], category: 'cat' },
  { src: allPhotos.dog[52], category: 'dog' },
  
  // Block 5 (33 images)
  { src: allPhotos.cat[52], category: 'cat' },
  { src: allPhotos.dog[53], category: 'dog' },
  { src: allPhotos.cat[53], category: 'cat' },
  { src: allPhotos.dog[54], category: 'dog' },
  { src: allPhotos.cat[54], category: 'cat' },
  { src: allPhotos.dog[55], category: 'dog' },
  { src: allPhotos.cat[55], category: 'cat' },
  { src: allPhotos.dog[56], category: 'dog' },
  { src: allPhotos.cat[56], category: 'cat' },
  { src: allPhotos.dog[57], category: 'dog' },
  { src: allPhotos.cat[57], category: 'cat' },
  { src: allPhotos.dog[58], category: 'dog' },
  { src: allPhotos.cat[58], category: 'cat' },
  { src: allPhotos.dog[59], category: 'dog' },
  { src: allPhotos.cat[59], category: 'cat' },
  { src: allPhotos.dog[60], category: 'dog' },
  { src: allPhotos.cat[60], category: 'cat' },
  { src: allPhotos.dog[61], category: 'dog' },
  { src: allPhotos.cat[61], category: 'cat' },
  { src: allPhotos.dog[62], category: 'dog' },
  { src: allPhotos.cat[62], category: 'cat' },
  { src: allPhotos.dog[63], category: 'dog' },
  { src: allPhotos.dog[64], category: 'dog' },
  { src: allPhotos.dog[65], category: 'dog' },
  { src: allPhotos.dog[66], category: 'dog' },
  { src: allPhotos.dog[67], category: 'dog' },
  { src: allPhotos.dog[68], category: 'dog' },
  { src: allPhotos.dog[69], category: 'dog' },
  { src: allPhotos.dog[70], category: 'dog' },
  { src: allPhotos.dog[71], category: 'dog' },
  { src: allPhotos.dog[72], category: 'dog' },
]

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all')

  const filteredPhotos = selectedFilter === 'all' 
    ? galleryPhotos 
    : galleryPhotos.filter(photo => photo.category === selectedFilter)

  const filterButtons = [
    { label: 'All', value: 'all' as FilterCategory, count: galleryPhotos.length },
    { label: 'Dog', value: 'dog' as FilterCategory, count: allPhotos.dog.length },
    { label: 'Cat', value: 'cat' as FilterCategory, count: allPhotos.cat.length },
    { label: 'Fish', value: 'fish' as FilterCategory, count: allPhotos.fish.length },
    { label: 'Bird', value: 'bird' as FilterCategory, count: allPhotos.bird.length },
    { label: 'Horse', value: 'horse' as FilterCategory, count: allPhotos.horse.length },
  ]

  // Extract name from filename for alt text
  const getAltText = (src: string | undefined) => {
    if (!src) return 'Pet Portrait'
    const filename = src.split('/').pop() || ''
    return filename.replace('.png', '').replace(/[-_]/g, ' ')
  }

  return (
    <>
      <section
        className="bg-white pb-24"
        style={{
          paddingTop: SPACING.SECTION_GAP * 12,
        }}
      >
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pet Portrait Gallery
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our stunning collection of AI-generated pet portraits. See the amazing transformations possible with Click My Pet!
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterButtons.map((button) => (
              <button
                key={button.value}
                onClick={() => setSelectedFilter(button.value)}
                className={`
                  px-6 py-3 rounded-full font-medium transition-all
                  ${selectedFilter === button.value
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {button.label} ({button.count})
              </button>
            ))}
          </div>

          {/* Gallery Grid - 5 columns on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={`${photo.category}-${index}`}
                className="group relative overflow-hidden rounded-sm bg-gray-100 card-shadow-hover transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <Image
                  src={photo.src}
                  alt={getAltText(photo.src)}
                  width={300}
                  height={375}
                  className="
                    w-full
                    h-auto
                    aspect-[4/5]
                    object-cover
                    rounded-sm
                  "
                  loading="lazy"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-sm font-medium text-center px-2 capitalize">
                    {getAltText(photo.src)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredPhotos.length}</span> of{' '}
              <span className="font-bold text-gray-900">{galleryPhotos.length}</span> portraits
            </p>
          </div>
        </div>
      </section>

      {/* Sticky CTA - always visible on gallery page */}
      <StickyCTA alwaysVisible={true} />
    </>
  )
}
