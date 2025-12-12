import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import SolidPlaceholder from '@/components/SolidPlaceholder'
import { blogPlaceholders } from '@/lib/placeholders'

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to blog</span>
        </Link>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              10 Essential Pet Photography Tips for Perfect AI Headshots
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>January 15, 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>5 min read</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Article
              </Button>
            </div>

            <SolidPlaceholder
              width={800}
              height={400}
              color={blogPlaceholders[0].color}
              alt="Pet photography tips"
              className="w-full h-64 md:h-96 rounded-2xl shadow-lg"
            />
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-800 leading-relaxed mb-8">
              Creating stunning AI-generated pet headshots starts with capturing great source photos. 
              Whether you're a professional photographer or a pet parent with a smartphone, 
              these essential tips will help you take photos that produce amazing AI results.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">1. Lighting is Everything</h2>
            <p className="text-gray-800 leading-relaxed mb-6">
              Natural light is your best friend when photographing pets. Position your furry model near 
              a large window during golden hour (early morning or late afternoon) for soft, flattering light. 
              Avoid harsh direct sunlight that creates unflattering shadows and causes your pet to squint.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">2. Get on Their Level</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The best pet photos are taken from the animal's eye level. This creates a more intimate 
              connection and natural perspective. For dogs, this usually means crouching or sitting on the ground. 
              For cats, you might need to photograph from a slightly higher angle.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">3. Focus on the Eyes</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sharp, clear eyes are crucial for AI processing. Make sure your camera focuses on the pet's eyes, 
              especially the eye closest to the camera. If the eyes aren't in focus, even the best AI won't 
              be able to create a stunning headshot.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">4. Use High Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Higher resolution photos give AI more detail to work with. Aim for at least 1024x1024 pixels, 
              but 2048x2048 or higher is even better. Most modern smartphones can capture photos at this resolution easily.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">5. Multiple Angles</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Take photos from different angles - front-facing, slight left turn, slight right turn, 
              and profile shots. This gives the AI a complete understanding of your pet's facial structure 
              and features, resulting in more accurate and varied generated images.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 my-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Pro Tip</h3>
              <p className="text-blue-800">
                Keep a bag of your pet's favorite treats nearby during the photo session. 
                The anticipation of treats will keep their ears perked up and create more 
                alert, engaging expressions perfect for professional headshots.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">6. Clean Background</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              While our AI can handle complex backgrounds, cleaner backgrounds often produce better results. 
              A simple wall, blanket, or outdoor setting without too many distracting elements works best.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">7. Capture Personality</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Don't just focus on perfect poses. Some of the best AI headshots come from photos that 
              capture your pet's unique personality - whether that's a head tilt, tongue out, 
              or their signature "smile."
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">8. Patience is Key</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pets won't always cooperate, and that's okay! Take breaks, let them play, 
              and return to shooting when they're more relaxed. The best photos often come 
              when your pet is comfortable and natural.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">9. Avoid Blur</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Motion blur can interfere with AI processing. Use a fast shutter speed or burst mode 
              to capture sharp images, especially with energetic pets who can't sit still for long.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">10. Have Fun!</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your pet can sense your energy. If you're stressed or frustrated, they will be too. 
              Keep the session light and fun - the joy will show in the final AI-generated portraits.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Create Amazing Pet Photos?</h3>
              <p className="text-black/90 mb-6">
                Now that you know the secrets, it's time to put them into practice. 
                Upload your best pet photos and see the magic happen!
              </p>
              <Link href="/checkout">
                <Button size="lg" className="bg-white text-black/90 hover:bg-gray-100 font-semibold">
                  Start Creating AI Pet Photos
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/blog/ai-photo-guide" className="group">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <SolidPlaceholder
                  width={400}
                  height={200}
                  color={blogPlaceholders[1].color}
                  alt="AI Photo Guide"
                  className="w-full h-32"
                />
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    The Complete Guide to AI Pet Photo Generation
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">8 min read</p>
                </div>
              </div>
            </Link>
            
            <Link href="/blog/social-media-success" className="group">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <SolidPlaceholder
                  width={400}
                  height={200}
                  color={blogPlaceholders[2].color}
                  alt="Social Media Success"
                  className="w-full h-32"
                />
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    How AI Pet Photos Boost Your Social Media Engagement
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">6 min read</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}