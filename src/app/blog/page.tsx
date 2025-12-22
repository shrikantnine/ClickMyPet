import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SolidPlaceholder from '@/components/SolidPlaceholder'
import { blogPlaceholders } from '@/lib/placeholders'

export const metadata: Metadata = {
  title: "Pet Photography Tips & AI Guide | Click My Pet Blog",
  description: "Expert pet photography tips, AI photo generation guides & creative ideas. Learn how to get stunning dog & cat portraits. Free guides & tutorials!",
  keywords: [
    "pet photography tips",
    "AI pet photo guide",
    "dog photography",
    "cat photo tips",
    "pet portrait ideas",
    "Instagram pet photos",
    "pet photo lighting",
    "AI portrait tutorial"
  ],
  openGraph: {
    title: "Click My Pet Blog - Pet Photography Tips & AI Guides",
    description: "Expert guides on pet photography and AI portrait generation. Free tips, tricks & creative ideas.",
    images: [{ url: "/og-blog.png" }],
  },
  alternates: {
    canonical: '/blog',
  },
}

// Blog post data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: 'pet-photography-tips',
    title: '10 Essential Pet Photography Tips for Perfect AI Headshots',
    excerpt: 'Learn the secrets to capturing stunning pet photos that will create amazing AI-generated headshots. From lighting to positioning, we cover everything you need to know.',
    color: blogPlaceholders[0].color,
    date: '2024-01-15',
    readTime: '5 min read',
    author: 'Sarah Johnson'
  },
  {
    slug: 'ai-photo-guide',
    title: 'The Complete Guide to AI Pet Photo Generation',
    excerpt: 'Discover how artificial intelligence transforms your pet photos into professional portraits. Understanding the technology behind the magic.',
    color: blogPlaceholders[1].color,
    date: '2024-01-10',
    readTime: '8 min read',
    author: 'Mike Chen'
  },
  {
    slug: 'social-media-success',
    title: 'How AI Pet Photos Boost Your Social Media Engagement',
    excerpt: 'Real case studies showing how professional pet photos increase likes, shares, and followers across Instagram, Facebook, and TikTok.',
    color: blogPlaceholders[2].color,
    date: '2024-01-05',
    readTime: '6 min read',
    author: 'Emma Davis'
  },
  {
    slug: 'choosing-right-style',
    title: 'Choosing the Right Style for Your Pet\'s Personality',
    excerpt: 'Match your pet\'s unique character with the perfect AI style. From corporate professional to artistic creative, find the right fit.',
    color: blogPlaceholders[3].color,
    date: '2023-12-28',
    readTime: '4 min read',
    author: 'Alex Rodriguez'
  },
  {
    slug: 'behind-the-scenes',
    title: 'Behind the Scenes: How We Train Our AI Models',
    excerpt: 'Take a peek into our AI development process and learn how we create models that understand pet features and expressions.',
    color: blogPlaceholders[4].color,
    date: '2023-12-20',
    readTime: '10 min read',
    author: 'Dr. Lisa Park'
  },
  {
    slug: 'success-stories',
    title: 'Customer Success Stories: Amazing Pet Transformations',
    excerpt: 'Real stories from pet parents who used Click My Pet to create memorable photos. See the before and after results that amazed everyone.',
    color: blogPlaceholders[5].color,
    date: '2023-12-15',
    readTime: '7 min read',
    author: 'Jennifer Lee'
  }
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Click My Pet Blog
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Tips, guides, and insights to help you create the most amazing AI pet photos. 
            Learn from experts and discover new ways to showcase your furry friends.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <SolidPlaceholder
                  width={600}
                  height={400}
                  color={blogPosts[0].color}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  FEATURED POST
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-gray-800 mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blogPosts[0].date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${blogPosts[0].slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <SolidPlaceholder
                width={600}
                height={400}
                color={post.color}
                alt={post.title}
                className="w-full h-48"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-800 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Stay Updated with Pet Photography Tips
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get the latest articles, tips, and exclusive insights delivered straight to your inbox. 
            Join thousands of pet parents creating amazing photos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}