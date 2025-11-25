'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'
import { SPACING } from '@/lib/utils'

const quickLinks = [
  { name: 'How it works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Referral Program', href: '/referral' },
  { name: 'FAQ', href: '#faq' },
]

const blogLinks = [
  { name: 'Pet Photography Tips', href: '/blog/pet-photography-tips' },
  { name: 'AI Photo Generation Guide', href: '/blog/ai-photo-guide' },
  { name: 'Social Media Success', href: '/blog/social-media-success' },
  { name: 'Latest Updates', href: '/blog' },
]

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms and Conditions', href: '/terms-conditions' },
  { name: 'Refund Policy', href: '/refund-policy' },
]

const socialLinks = [
  { 
    name: 'Instagram', 
    href: 'https://instagram.com/clickmypet', 
    icon: Instagram 
  },
  { 
    name: 'Facebook', 
    href: 'https://facebook.com/clickmypet', 
    icon: Facebook 
  },
  { 
    name: 'X (Twitter)', 
    href: 'https://x.com/clickmypet', 
    icon: Twitter 
  },
  { 
    name: 'YouTube', 
    href: 'https://youtube.com/@clickmypet', 
    icon: Youtube 
  },
]

export default function Footer() {
  return (
    <footer 
      id="footer" 
      className="bg-gray-900 text-white"
      style={{ paddingTop: SPACING.SECTION_GAP * 6, paddingBottom: SPACING.SECTION_GAP * 4 }}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CMP</span>
              </div>
              <span className="font-bold text-xl">Click My Pet</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Blog</h3>
            <ul className="space-y-2">
              {blogLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              Made with ❤️ for pet parents worldwide
            </p>
            <p className="text-gray-500 text-sm">
              Questions? Email us at{' '}
              <a href="mailto:support@clickmypet.com" className="text-blue-400 hover:text-blue-300">
                support@clickmypet.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}