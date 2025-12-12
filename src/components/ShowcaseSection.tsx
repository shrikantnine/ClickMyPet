'use client'

import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { SPACING } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Showcase photos - Target distribution: 9 Dogs, 8 Cats, 2 Fish, 2 Birds, 2 Horses (21 total) - evenly distributed
const showcasePhotos = [
  { src: '/Dog/Chihuahua Portrait High Five.png', heading: 'Professional Portrait' },
  { src: '/Cat/Persian Cat Superhero Ironman.png', heading: 'Superhero Style' },
  { src: '/Dog/Siberian Husky Chilling In Car.png', heading: 'Lifestyle Shot' },
  { src: '/Cat/Norwagian Forest Cat Skateboarding.png', heading: 'Action & Sport' },
  { src: '/Other/Betta Fish Portrait Aquarium 3.png', heading: 'Aquatic Beauty' },
  { src: '/Dog/French Bulldog Mugshot Guilty As Charged.png', heading: 'Funny Mugshot' },
  { src: '/Cat/Orange Cat iAngry.png', heading: 'Expressive Portrait' },
  { src: '/Other/Lovebird Portrait 2.png', heading: 'Avian Portrait' },
  { src: '/Dog/Cavalier King Charles Spaniel Looking Out Of Window.png', heading: 'Candid Moment' },
  { src: '/Cat/British Shorthair Looking Out Of Window.png', heading: 'Window Gaze' },
  { src: '/Other/Hanoverian Warmblood Horse Portrait.png', heading: 'Equestrian Beauty' },
  { src: '/Dog/Pug On Skateboard.png', heading: 'Sport Action' },
  { src: '/Cat/Domestic Shorthair Cat Looking Out Of Window.png', heading: 'Contemplative' },
  { src: '/Dog/Yorkshire Terrier Mugshot.png', heading: 'Character Shot' },
  { src: '/Cat/Exotic Shorthair Vacation Beach.png', heading: 'Beach Vacation' },
  { src: '/Other/Canary Bird Portrait.png', heading: 'Tropical Bird' },
  { src: '/Dog/Pembroke Welsh Corgi Portrait.png', heading: 'Classic Portrait' },
  { src: '/Cat/Domestic Longhair Cat Royal Portrait.png', heading: 'Royal Portrait' },
  { src: '/Dog/Miniature Schnauzer Looking Out Of Window.png', heading: 'Thoughtful Gaze' },
  { src: '/Cat/American Shorthair Cat Glasses.png', heading: 'Smart & Stylish' },
  { src: '/Other/American Quarter Horse Portrait.png', heading: 'Majestic Horse' },
]

export default function ShowcaseSection() {
  return (
    <section 
      id="showcase" 
      className="bg-gray-50 w-screen h-[63vh] flex flex-col justify-center"
      style={{ paddingTop: SPACING.SECTION_GAP * 2, paddingBottom: SPACING.SECTION_GAP * 2 }}
    >
      <div className="w-full">
        <div className="container mx-auto px-4 mb-12">
          <h3 className="text-center text-sm font-semibold text-gray-800 uppercase tracking-wider mb-6">
            Popular Styles & Use Cases
          </h3>
        </div>
        
        {/* Full-width Marquee */}
        <div className="w-full overflow-hidden">
          <Marquee className="[--duration:80s] py-4" speed={82}>
            {showcasePhotos.map((photo, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center"
                style={{ margin: "0 0.3rem" }} // uniform horizontal gap
              >
                <div
                  className="
                    relative overflow-hidden rounded-sm card-shadow
                    flex items-center justify-center
                    h-[31vh] w-[24.8vh]
                    md:h-[31vh] md:w-[24.8vh]
                  "
                  style={{
                    aspectRatio: "4/5",
                    height: "31vh",
                    width: "24.8vh",
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.heading}
                    width={400}
                    height={500}
                    loading="lazy"
                    className="
                      w-full h-full object-cover
                      hover:scale-105 transition-transform duration-300
                    "
                  />
                </div>
                <h4 className="mt-3 text-base font-medium text-black text-center max-w-[200px]">
                  {photo.heading}
                </h4>
              </div>
            ))}
          </Marquee>
        </div>

        {/* CTA Button */}
        <div className="container mx-auto px-4 mt-12 text-center">
          <Button variant="moody-fill" size="lg" className="px-8 rounded-full">
            Explore More
          </Button>
        </div>
      </div>
    </section>
  )
}
