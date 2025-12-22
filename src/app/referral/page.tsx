'use client'

import { useState } from 'react'
import { Copy, Check, Users, DollarSign, TrendingUp, Gift, Zap, Share2, Instagram, Youtube, Twitter, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'

// Marquee images - Row 1
const marqueeImagesRow1 = [
  '/Dog/Beagle Cool Portrait Glasses Hat.png',
  '/Cat/Abyssinian Cat Spiderman Superhero.png',
  '/Dog/Bernese Mountain Dog Aniversary.png',
  '/Cat/Bengal Cat On Skateboard.png',
  '/Dog/Boxer Gold Chain Glasses Hat Portrait.png',
  '/Cat/Birman Cat Portrait.png',
  '/Dog/Bulldog Gangster Chilling In Car.png',
  '/Cat/Bombay Cat Sant Christmas Xmas.png',
]

// Marquee images - Row 2 (Different images)
const marqueeImagesRow2 = [
  '/Dog/Golden Retriever Santa Xmas.png',
  '/Cat/Persian Cat Superhero Superman.png',
  '/Dog/German Shepherd Suite Portrait.png',
  '/Cat/Maine Coon Cat Royal Portrait.png',
  '/Dog/Poodle Ex Royalty Portrait.png',
  '/Cat/Siamese Cat Gold Chain Hat Glasses.png',
  '/Dog/Shiba Inu Portrait.png',
  '/Cat/Turkish Angora Chilling In Car.png',
]

// Marquee images - Row 3 (Unique images for mobile)
const marqueeImagesRow3 = [
  '/Dog/Boston Terrier Portrait Tie.png',
  '/Cat/British Shorthair Fire Fighter.png',
  '/Dog/Chihuahua Gold Chain Hat Glasses.png',
  '/Cat/Devon Rex Cat Royal Portrait.png',
  '/Dog/Dachshund High Five Excited.png',
  '/Cat/American Shorthair Cat Glasses.png',
  '/Dog/Cavalier King Charles Spaniel Superhero.png',
  '/Cat/Burmese Cat Mugshot.png',
]

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('YOURNAME')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://petpx.com/ref/${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Marquee Background */}
      <section className="relative min-h-[600px] overflow-hidden bg-white">
        {/* Marquee Background - Desktop: 2 Rows, Mobile: 3 Rows */}
        <div className="absolute inset-0 opacity-20 flex flex-col gap-1 md:gap-4">
          {/* Row 1 - Left to Right */}
          <div className="flex-1 w-full h-full">
            <Marquee speed={40} gradient={false} direction="left" className="h-full w-full flex items-center">
              {marqueeImagesRow1.map((src, index) => (
                <div key={`row1-${index}`} style={{ margin: '0 0.5rem' }}>
                  <Image
                    src={src}
                    alt="Pet Portrait"
                    width={280}
                    height={280}
                    className="rounded-2xl object-cover h-[25vh] w-[20vh] md:h-auto md:w-[280px]"
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
          </div>
          
          {/* Row 2 - Right to Left */}
          <div className="flex-1 w-full h-full">
            <Marquee speed={40} gradient={false} direction="right" className="h-full w-full flex items-center">
              {marqueeImagesRow2.map((src, index) => (
                <div key={`row2-${index}`} style={{ margin: '0 0.5rem' }}>
                  <Image
                    src={src}
                    alt="Pet Portrait"
                    width={280}
                    height={280}
                    className="rounded-2xl object-cover h-[25vh] w-[20vh] md:h-auto md:w-[280px]"
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
          </div>

          {/* Row 3 - Left to Right (Mobile only) */}
          <div className="flex-1 w-full h-full md:hidden">
            <Marquee speed={40} gradient={false} direction="left" className="h-full w-full flex items-center">
              {marqueeImagesRow3.map((src, index) => (
                <div key={`row3-${index}`} style={{ margin: '0 0.5rem' }}>
                  <Image
                    src={src}
                    alt="Pet Portrait"
                    width={280}
                    height={280}
                    className="rounded-2xl object-cover h-[25vh] w-[20vh]"
                    loading="lazy"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">
            Partner Program
          </h1>
          <p className="text-2xl md:text-3xl text-black mb-12">
            Earn 30% commission on every sale
          </p>
          
          {/* Frosted Glass Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-black/10 shadow-xl">
              <div className="text-5xl font-bold text-black mb-2">30%</div>
              <div className="text-sm text-black/70">Commission</div>
            </div>
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-black/10 shadow-xl">
              <div className="text-5xl font-bold text-black mb-2">120</div>
              <div className="text-sm text-black/70">Day Cookie</div>
            </div>
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-black/10 shadow-xl">
              <div className="text-5xl font-bold text-black mb-2">$10</div>
              <div className="text-sm text-black/70">Min Payout</div>
            </div>
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-black/10 shadow-xl">
              <div className="text-5xl font-bold text-black mb-2">∞</div>
              <div className="text-sm text-black/70">Recurring</div>
            </div>
          </div>

          <Button size="lg" className="bg-blue-400 hover:bg-blue-500 text-white text-xl px-12 py-6 rounded-full font-bold shadow-xl">
            Apply Now
          </Button>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            Commission Structure
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-black/10">
              <h3 className="text-2xl font-bold text-black mb-6">Starter</h3>
              <div className="mb-6">
                <div className="text-sm text-black/60 mb-1">Customer Pays</div>
                <div className="text-4xl font-bold text-black">$15</div>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 border border-black/10 mb-6">
                <div className="text-sm text-black/60 mb-1">You Earn</div>
                <div className="text-4xl font-bold text-black">$4.50</div>
              </div>
              <div className="space-y-3 text-sm text-black/70">
                <div className="flex justify-between">
                  <span>100 sales</span>
                  <span className="font-bold text-black">$450/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>500 sales</span>
                  <span className="font-bold text-black">$2,250/mo</span>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-2 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-400 text-white px-6 py-2 rounded-full text-sm font-bold">
                  POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-6">Pro</h3>
              <div className="mb-6">
                <div className="text-sm text-black/60 mb-1">Customer Pays</div>
                <div className="text-4xl font-bold text-black">$29</div>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 border border-black/10 mb-6">
                <div className="text-sm text-black/60 mb-1">You Earn</div>
                <div className="text-4xl font-bold text-black">$8.70</div>
              </div>
              <div className="space-y-3 text-sm text-black/70">
                <div className="flex justify-between">
                  <span>100 sales</span>
                  <span className="font-bold text-black">$870/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>500 sales</span>
                  <span className="font-bold text-black">$4,350/mo</span>
                </div>
              </div>
            </div>

            {/* Max Plan */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-black/10">
              <h3 className="text-2xl font-bold text-black mb-6">Max</h3>
              <div className="mb-6">
                <div className="text-sm text-black/60 mb-1">Customer Pays</div>
                <div className="text-4xl font-bold text-black">$49</div>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-2xl p-6 border border-black/10 mb-6">
                <div className="text-sm text-black/60 mb-1">You Earn</div>
                <div className="text-4xl font-bold text-black">$14.70</div>
              </div>
              <div className="space-y-3 text-sm text-black/70">
                <div className="flex justify-between">
                  <span>100 sales</span>
                  <span className="font-bold text-black">$1,470/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>500 sales</span>
                  <span className="font-bold text-black">$7,350/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Incentives */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            Performance Bonuses
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-10 border border-black/10 shadow-xl text-center">
              <div className="text-6xl mb-6">🥉</div>
              <h3 className="text-3xl font-bold text-black mb-3">20 Sales</h3>
              <div className="text-4xl font-bold text-black">+$50</div>
            </div>

            <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-10 border-2 border-blue-400 shadow-2xl text-center">
              <div className="text-6xl mb-6">🥈</div>
              <h3 className="text-3xl font-bold text-black mb-3">100 Sales</h3>
              <div className="text-4xl font-bold text-black">+$250</div>
            </div>

            <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-10 border border-black/10 shadow-xl text-center">
              <div className="text-6xl mb-6">🏆</div>
              <h3 className="text-3xl font-bold text-black mb-3">500 Sales</h3>
              <div className="text-4xl font-bold text-black">+$1,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Sign Up</h3>
            </div>

            <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Share</h3>
            </div>

            <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Earn 30%</h3>
            </div>

            <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-16 h-16 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Get Paid</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Options */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            Tracking & Analytics
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Unique Link */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-black/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <LinkIcon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black">Referral Links</h3>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 font-mono text-base mb-4 border border-black/10">
                <span className="text-black">clickmypet.com/ref/</span><span className="text-blue-600 font-bold">YOURNAME</span>
              </div>
              <p className="text-sm text-black/70">120-day cookie • Automatic attribution</p>
            </div>

            {/* Coupon Codes */}
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-black/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Gift className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-black">Custom Codes</h3>
              </div>
              <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 font-mono text-base mb-4 border border-black/10">
                <span className="text-blue-600 font-bold">YOURNAME10</span> <span className="text-black">• 10% OFF</span>
              </div>
              <p className="text-sm text-black/70">Unlimited codes • Track by platform</p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-black/10">
            <h3 className="text-3xl font-bold text-black mb-8 text-center">
              Real-Time Dashboard
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
                <div className="text-4xl font-bold text-black mb-2">1,247</div>
                <div className="text-sm text-black/60">Clicks</div>
              </div>
              <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
                <div className="text-4xl font-bold text-black mb-2">156</div>
                <div className="text-sm text-black/60">Sales</div>
              </div>
              <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
                <div className="text-4xl font-bold text-black mb-2">12.5%</div>
                <div className="text-sm text-black/60">Rate</div>
              </div>
              <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10">
                <div className="text-4xl font-bold text-black mb-2">$1,356</div>
                <div className="text-sm text-black/60">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            Perfect For
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 text-center border border-black/10 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Instagram className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Influencers</h3>
              <div className="text-4xl font-bold text-black mb-2">$1,250</div>
              <div className="text-sm text-black/60">avg/month</div>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 text-center border-2 border-blue-400 shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Youtube className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">YouTubers</h3>
              <div className="text-4xl font-bold text-black mb-2">$2,100</div>
              <div className="text-sm text-black/60">avg/month</div>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 text-center border border-black/10 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Communities</h3>
              <div className="text-4xl font-bold text-black mb-2">$850</div>
              <div className="text-sm text-black/60">avg/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-black mb-16">
            FAQs
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-black/10">
              <h3 className="text-xl font-bold text-black mb-3">Payouts?</h3>
              <p className="text-black/70">Weekly, $0 minimum</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-black/10">
              <h3 className="text-xl font-bold text-black mb-3">Cookie window?</h3>
              <p className="text-black/70">120 days tracking</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-black/10">
              <h3 className="text-xl font-bold text-black mb-3">Custom codes?</h3>
              <p className="text-black/70">Unlimited, keep 30%</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-black/10">
              <h3 className="text-xl font-bold text-black mb-3">Approval?</h3>
              <p className="text-black/70">Instant access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold text-black mb-12">
            Get Started
          </h2>
          
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-10 mb-10 border border-black/10 shadow-xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="flex-1 max-w-md px-8 py-5 rounded-2xl text-black text-xl font-semibold text-center border-2 border-black/10 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-blue-400"
                placeholder="YOURNAME"
              />
              <Button
                onClick={handleCopy}
                size="lg"
                className="bg-blue-400 hover:bg-blue-500 text-white px-10 py-5 text-lg"
              >
                {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
              </Button>
            </div>
            <div className="text-sm text-black/70">
              <span className="font-mono bg-white/60 px-4 py-2 rounded-lg border border-black/10">
                clickmypet.com/ref/{referralCode}
              </span>
            </div>
          </div>

          <Button size="lg" className="bg-blue-400 hover:bg-blue-500 text-white text-xl px-16 py-7 rounded-full font-bold shadow-xl">
            Apply Now
          </Button>

          <p className="text-sm text-black/60 mt-8">
            Free to join • 30% recurring commission
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
