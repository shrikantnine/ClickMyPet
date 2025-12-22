// Structured Data (JSON-LD Schema) for SEO Rich Snippets
// This component provides search engines with detailed product, service, and business information

export function getStructuredData() {
  const baseUrl = 'https://clickmypet.com'

  // 1. Organization Schema - Company Information
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Click My Pet',
    alternateName: 'Click My Pet',
    url: baseUrl,
    logo: `${baseUrl}/heading.png`,
    description: 'AI-powered pet portrait generation service offering professional quality pet photos in 15+ artistic styles',
    email: 'support@clickmypet.com',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/clickmypet',
      'https://facebook.com/clickmypet',
      'https://instagram.com/clickmypet',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@clickmypet.com',
      availableLanguage: ['English'],
    },
  }

  // 2. WebSite Schema - Search Functionality
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Click My Pet',
    description: 'Transform your pet photos into stunning AI portraits with professional quality',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/gallery?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // 3. Service Schema - AI Pet Portrait Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#service`,
    serviceType: 'AI Pet Portrait Generation',
    name: 'AI Pet Photo Generator',
    description: 'Professional AI-generated pet portraits in 15+ artistic styles including Disney, Pixar, Watercolor, Oil Painting, and more. Supports dogs, cats, birds, fish, horses, and all pets.',
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/onboarding`,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '15',
      highPrice: '49',
      offerCount: '3',
    },
    category: 'Pet Photography',
    audience: {
      '@type': 'Audience',
      audienceType: 'Pet Owners',
    },
  }

  // 4. Product Schema - Starter Plan
  const productStarterSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/#product-starter`,
    name: 'Click My Pet Starter Plan',
    description: 'Perfect for trying out AI pet portraits. Generate 20 high-quality images in 2 styles with 2 background choices.',
    image: `${baseUrl}/og-image.png`,
    brand: {
      '@type': 'Brand',
      name: 'Click My Pet',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/checkout`,
      priceCurrency: 'USD',
      price: '15.00',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    category: 'Pet Photography Service',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Images Included',
        value: '20',
      },
      {
        '@type': 'PropertyValue',
        name: 'Style Options',
        value: '2',
      },
      {
        '@type': 'PropertyValue',
        name: 'Background Choices',
        value: '2',
      },
      {
        '@type': 'PropertyValue',
        name: 'Resolution',
        value: 'HD',
      },
    ],
  }

  // 5. Product Schema - Pro Plan (Most Popular)
  const productProSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/#product-pro`,
    name: 'Click My Pet Pro Plan',
    description: 'Most popular choice for pet portraits. Generate 40 premium images in 8 styles with all backgrounds, 2K resolution, and priority support.',
    image: `${baseUrl}/og-image.png`,
    brand: {
      '@type': 'Brand',
      name: 'Click My Pet',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/checkout`,
      priceCurrency: 'USD',
      price: '29.00',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '284',
      bestRating: '5',
      worstRating: '1',
    },
    category: 'Pet Photography Service',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Images Included',
        value: '40',
      },
      {
        '@type': 'PropertyValue',
        name: 'Style Options',
        value: '8',
      },
      {
        '@type': 'PropertyValue',
        name: 'Background Choices',
        value: 'All (25+)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Resolution',
        value: '2K',
      },
      {
        '@type': 'PropertyValue',
        name: 'Premium Accessories',
        value: 'Included',
      },
      {
        '@type': 'PropertyValue',
        name: 'Priority Support',
        value: 'Yes',
      },
    ],
  }

  // 6. Product Schema - Max Plan (Best Value)
  const productMaxSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/#product-max`,
    name: 'Click My Pet Max Plan',
    description: 'Best value package with 100 stunning images in all 15+ styles, all 25+ backgrounds, 4K resolution, commercial usage rights, and custom style requests.',
    image: `${baseUrl}/og-image.png`,
    brand: {
      '@type': 'Brand',
      name: 'Click My Pet',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/checkout`,
      priceCurrency: 'USD',
      price: '49.00',
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '156',
      bestRating: '5',
      worstRating: '1',
    },
    category: 'Pet Photography Service',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Images Included',
        value: '100',
      },
      {
        '@type': 'PropertyValue',
        name: 'Style Options',
        value: 'All (15+)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Background Choices',
        value: 'All (25+)',
      },
      {
        '@type': 'PropertyValue',
        name: 'Resolution',
        value: '4K Ultra HD',
      },
      {
        '@type': 'PropertyValue',
        name: 'Premium Accessories',
        value: 'All Included',
      },
      {
        '@type': 'PropertyValue',
        name: 'Custom Style Requests',
        value: 'Yes',
      },
      {
        '@type': 'PropertyValue',
        name: 'Commercial Usage Rights',
        value: 'Included',
      },
      {
        '@type': 'PropertyValue',
        name: 'Priority Support',
        value: 'Yes',
      },
    ],
  }

  // 7. ItemList Schema - Available Pet Species
  const petSpeciesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Supported Pet Species',
    description: 'All pet species supported by Click My Pet AI portrait generator',
    numberOfItems: 6,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Dogs',
        description: 'All dog breeds including Golden Retriever, German Shepherd, Bulldog, Beagle, Poodle, Shiba Inu, Chihuahua, Dachshund, and 150+ more',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cats',
        description: 'All cat breeds including Persian, Maine Coon, Siamese, Bengal, British Shorthair, Abyssinian, Turkish Angora, and 70+ more',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Birds',
        description: 'Parrots, budgies, cockatiels, canaries, and all bird species',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Fish',
        description: 'Goldfish, bettas, tropical fish, and aquarium pets',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Horses',
        description: 'All horse breeds and equestrian portraits',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Other Pets',
        description: 'Rabbits, guinea pigs, hamsters, reptiles, and exotic pets',
      },
    ],
  }

  // 8. ItemList Schema - Available Art Styles
  const artStylesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Pet Portrait Styles',
    description: '15+ professional artistic styles for pet portraits',
    numberOfItems: 15,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Cartoon Style',
        description: 'Vibrant animated character portraits with bright colors',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '3D Animated',
        description: 'Professional 3D rendered animated portraits',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Watercolor',
        description: 'Soft watercolor painting effect',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Oil Painting',
        description: 'Classic oil painting portrait',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Pop Art',
        description: 'Bold colorful pop art style',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Professional Studio',
        description: 'Clean corporate professional headshot',
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Royal Portrait',
        description: 'Regal renaissance-style portrait',
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Superhero Comic',
        description: 'Comic book superhero style',
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Vintage',
        description: 'Classic vintage photograph effect',
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Anime',
        description: 'Japanese anime character style',
      },
      {
        '@type': 'ListItem',
        position: 11,
        name: 'Fun Cartoon',
        description: 'Playful animated cartoon style',
      },
      {
        '@type': 'ListItem',
        position: 12,
        name: 'Pencil Sketch',
        description: 'Hand-drawn pencil portrait',
      },
      {
        '@type': 'ListItem',
        position: 13,
        name: 'Cyberpunk',
        description: 'Futuristic neon cyberpunk aesthetic',
      },
      {
        '@type': 'ListItem',
        position: 14,
        name: 'Fantasy Art',
        description: 'Magical fantasy world setting',
      },
      {
        '@type': 'ListItem',
        position: 15,
        name: 'Custom Style',
        description: 'Request your own unique artistic style',
      },
    ],
  }

  // 9. ItemList Schema - Background Options
  const backgroundsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Pet Portrait Backgrounds',
    description: '25+ professional background options',
    numberOfItems: 10,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Studio Backgrounds',
        description: 'Clean white, black, or grey studio backdrops',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nature Scenes',
        description: 'Forests, mountains, beaches, gardens',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Urban Settings',
        description: 'City streets, modern interiors, rooftops',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Seasonal Themes',
        description: 'Christmas, Halloween, Easter, birthdays',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Fantasy Worlds',
        description: 'Magical lands, castles, space, underwater',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Office & Professional',
        description: 'Corporate settings, libraries, offices',
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Home Interiors',
        description: 'Living rooms, bedrooms, cozy settings',
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Outdoor Adventures',
        description: 'Hiking trails, parks, lakes, camping',
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Abstract & Artistic',
        description: 'Color gradients, patterns, textures',
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Custom Backgrounds',
        description: 'Upload your own or request specific scenes',
      },
    ],
  }

  // 10. FAQ Schema - Common Questions
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Click My Pet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Click My Pet is an AI-powered pet portrait generator that transforms your pet photos into professional-quality portraits in 15+ artistic styles. Simply upload a photo, choose your style and background, and receive stunning AI-generated images in minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of pets are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We support all pets including dogs (all breeds), cats (all breeds), birds, fish, horses, rabbits, guinea pigs, hamsters, reptiles, and exotic pets. Our AI is trained on thousands of pet images across all species.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does Click My Pet cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Click My Pet offers three plans: Starter ($15 for 20 images), Pro ($29 for 40 images - most popular), and Max ($49 for 100 images). All plans include multiple style options, backgrounds, and high-resolution downloads.',
        },
      },
      {
        '@type': 'Question',
        name: 'What art styles are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer 15+ professional styles including Cartoon Style, 3D Animated, Watercolor, Oil Painting, Pop Art, Professional Studio, Royal Portrait, Superhero Comic, Vintage, Anime, Pencil Sketch, Cyberpunk, Fantasy Art, and custom requests. Each style is carefully crafted to highlight your pet\'s personality.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does it take to generate images?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most portraits are generated within 5-10 minutes. You\'ll receive an email notification when your images are ready. Our Pro and Max plans include priority processing for even faster results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What resolution are the images?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Starter plan includes HD resolution, Pro plan offers 2K resolution, and Max plan provides 4K ultra HD quality. All images are high-resolution and perfect for printing, social media, or professional use.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use the images commercially?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Commercial usage rights are included with our Max plan ($49). This allows you to use the images for business purposes, marketing, merchandise, or any commercial application. Starter and Pro plans are for personal use only.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer refunds?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer a 100% satisfaction guarantee. If you\'re not happy with your portraits, contact us within 7 days for a full refund. We stand behind the quality of our AI-generated images.',
        },
      },
    ],
  }

  // 11. BreadcrumbList Schema - Site Navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gallery',
        item: `${baseUrl}/gallery`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Pricing',
        item: `${baseUrl}/#pricing`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
    ],
  }

  // Return all schemas
  return {
    organizationSchema,
    websiteSchema,
    serviceSchema,
    productStarterSchema,
    productProSchema,
    productMaxSchema,
    petSpeciesSchema,
    artStylesSchema,
    backgroundsSchema,
    faqSchema,
    breadcrumbSchema,
  }
}
