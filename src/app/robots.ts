import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://clickmypet.com'

  return {
    rules: [
      // Main Search Engines - Full Access
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/result/'],
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/result/'],
      },
      {
        userAgent: ['Bingbot', 'Slurp', 'DuckDuckBot'],
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/result/'],
        crawlDelay: 1,
      },

      // Default Rules for Other Crawlers
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/blog/*',
          '/gallery',
          '/onboarding',
          '/referral',
          '/privacy-policy',
          '/terms-conditions',
        ],
        disallow: [
          '/admin/',
          '/officeoftheadmin/',
          '/dashboard',
          '/result',
          '/checkout',
          '/payment-success',
          '/login',
          '/api/',
          '/_next/',
          '/_vercel/',
        ],
      },

      // Block AI Scrapers
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },

      // Block Bad Bots
      {
        userAgent: ['AhrefsBot', 'MJ12bot', 'DotBot', 'BLEXBot'],
        disallow: '/',
      },

      // Rate Limit Aggressive Crawlers
      {
        userAgent: ['SemrushBot', 'Yandex', 'Baiduspider'],
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/result/'],
        crawlDelay: 5,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
