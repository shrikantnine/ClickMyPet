import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Terms & Conditions - Service Agreement | Click My Pet",
  description: "Read Click My Pet terms of service, usage rights, refund policy & commercial licensing. Understand your rights when using our AI pet photo generator.",
  keywords: [
    "Click My Pet terms",
    "service terms",
    "usage rights",
    "refund policy"
  ],
  alternates: {
    canonical: '/terms-conditions',
  },
}

export default function TermsConditionsPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="text-gray-600 mb-8">
            <p>Last updated: January 1, 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Click My Pet ("the Service"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Click My Pet is an AI-powered service that generates professional pet headshots from user-uploaded photos. 
                Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>AI photo generation and enhancement</li>
                <li>Multiple style and background options</li>
                <li>High-resolution image downloads</li>
                <li>Customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our service, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information when creating an account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be at least 18 years old or have parental consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to use our service only for lawful purposes and in accordance with these Terms. 
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Upload photos that violate copyright, privacy, or other rights</li>
                <li>Upload inappropriate, offensive, or harmful content</li>
                <li>Use the service for commercial purposes without proper licensing</li>
                <li>Attempt to reverse engineer or copy our AI technology</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Payment terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>All payments are processed securely through our payment partners</li>
                <li>Prices are subject to change with notice</li>
                <li>Refunds are available within 30 days of purchase if you're not satisfied</li>
                <li>Generated images are delivered digitally and cannot be returned</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ownership and rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You retain all rights to photos you upload</li>
                <li>Generated AI images are owned by you upon payment</li>
                <li>Our AI technology, website, and branding remain our property</li>
                <li>You grant us limited rights to process your photos for service delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We reserve the right to modify, suspend, or discontinue the service with reasonable notice. 
                Processing times may vary based on demand and technical factors.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, Click My Pet shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
                intangible losses resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without 
                prior notice, for conduct that we believe violates these Terms or is harmful to other 
                users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes via email or website notice. Continued use of the service after changes constitutes 
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  Email: <a href="mailto:legal@clickmypet.com" className="text-blue-600 hover:text-blue-700">legal@clickmypet.com</a><br/>
                  Address: 123 Pet Street, AI City, TC 12345
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}