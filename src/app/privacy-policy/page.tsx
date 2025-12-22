import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Privacy Policy - How We Protect Your Data | Click My Pet",
  description: "Learn how Click My Pet protects your privacy & pet photos. GDPR compliant. Secure storage, no data sharing. Read our privacy policy & cookie usage details.",
  keywords: [
    "Click My Pet privacy",
    "pet photo privacy",
    "GDPR compliance",
    "data protection"
  ],
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="text-gray-800 mb-8">
            <p>Last updated: November 2024</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-800 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                upload photos, make a purchase, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-800 space-y-2">
                <li>Name and email address</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>Pet photos you upload for AI processing</li>
                <li>Communication preferences</li>
                <li>Support requests and correspondence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and improve our AI photo generation services</li>
                <li>Process payments and deliver your generated photos</li>
                <li>Send you service-related communications</li>
                <li>Provide customer support</li>
                <li>Improve our AI models and service quality</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Photo Privacy and Usage</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your pet photos are important to us, and we treat them with the utmost care:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We only use uploaded photos to generate your requested AI images</li>
                <li>Photos are automatically deleted from our servers after 30 days</li>
                <li>We do not use your photos to train our AI models without explicit consent</li>
                <li>Generated images belong to you and can be used for personal or commercial purposes</li>
                <li>We do not share or sell your photos to third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to outside parties except:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With your explicit consent</li>
                <li>To trusted service providers who assist in operating our website and services</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. This includes 
                encryption of data in transit and at rest, regular security assessments, and limited access 
                to personal information on a need-to-know basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience, analyze website traffic, 
                and understand visitor behavior. The information we collect includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Marketing Cookies:</strong> Track your browsing behavior to show relevant advertisements</li>
                <li><strong>Device Information:</strong> Browser type, operating system, screen resolution, and device fingerprint</li>
                <li><strong>Browsing Data:</strong> Pages visited, time spent on site, scroll depth, and click interactions</li>
                <li><strong>Traffic Sources:</strong> Referrer URLs and UTM campaign parameters to understand how you found us</li>
                <li><strong>Local Storage:</strong> Non-sensitive data stored in your browser for improved functionality</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                When you first visit our website, you'll see a cookie consent banner. You can choose to accept or decline 
                tracking cookies. You can also control cookie settings through your browser preferences. Some features may 
                not function properly if cookies are disabled.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                <strong>Visitor Tracking:</strong> We assign a unique visitor ID to track anonymous browsing behavior. 
                When you provide your email address, we link it to your visitor profile to provide personalized 
                experiences and targeted marketing communications. You can request deletion of your visitor data at 
                any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  Email: <a href="mailto:privacy@clickmypet.com" className="text-blue-600 hover:text-blue-700">privacy@clickmypet.com</a><br/>
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