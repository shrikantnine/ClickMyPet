import type { Metadata } from 'next'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import TestimonialSection from '@/components/TestimonialSection'
import StickyCTA from '@/components/StickyCTA'
import ShowcaseSection from '@/components/ShowcaseSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import GallerySection from '@/components/GallerySection'
import PricingSection from '@/components/PricingSection'
import TrustBadges from '@/components/TrustBadges'
import FAQSection from '@/components/FAQSection'
import ClosingSection from '@/components/ClosingSection'
import Footer from '@/components/Footer'
import SignupPopupManager from '@/components/SignupPopupManager'

export const metadata: Metadata = {
  title: "PetPX - AI Pet Photo Generator | Create Professional Pet Portraits Instantly",
  description: "Transform your dog, cat, or pet photos into stunning AI portraits. Choose from 15+ artistic styles like Disney, Watercolor & Professional. From $15. Create yours now!",
  keywords: [
    "AI pet photo generator",
    "dog photo AI",
    "cat portrait AI",
    "pet headshot generator",
    "professional pet photography",
    "AI pet pictures",
    "Disney style pet photos",
    "watercolor pet portrait"
  ],
  openGraph: {
    title: "PetPX - Turn Your Pet Into An AI Masterpiece",
    description: "Professional AI pet portraits in seconds. 15+ styles, 25+ backgrounds, 4K quality. Dogs, cats & more from $15.",
    images: [{ url: "/og-home.png" }],
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <div className="bg-white/100 min-h-screen">
      <Header />
      
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        
        <TestimonialSection />
        <ShowcaseSection />
        <HowItWorksSection />
        <GallerySection />
        <PricingSection />
        <TrustBadges />
        <FAQSection />
        <ClosingSection />
      </main>
      
      <Footer />
      <StickyCTA />
      <SignupPopupManager />
    </div>
  )
}