import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisitorTrackingProvider } from "@/components/VisitorTrackingProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { getStructuredData } from "@/lib/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetPX - AI Pet Photo Generator | Professional Pet Portraits in Seconds",
  description: "Transform your pet photos into stunning AI portraits. 15+ artistic styles, 25+ backgrounds, 4K quality. Dogs, cats & more. From $15. Try free!",
  keywords: [
    "AI pet photo generator",
    "pet portrait AI",
    "dog photo AI",
    "cat portrait generator",
    "AI pet pictures",
    "professional pet photography",
    "pet headshot generator",
    "Disney style pet photos",
    "watercolor pet portrait",
    "custom pet portraits"
  ],
  authors: [{ name: "PetPX" }],
  creator: "PetPX",
  publisher: "PetPX",
  metadataBase: new URL('https://petpx.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PetPX - AI Pet Photo Generator | Professional Pet Portraits",
    description: "Create stunning AI pet portraits in seconds. 15+ styles, 25+ backgrounds. From $15. Try free!",
    url: "https://petpx.com",
    siteName: "PetPX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PetPX - AI Generated Pet Portraits"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetPX - Turn Your Pet Photos Into AI Masterpieces",
    description: "Professional AI pet portraits from $15. 15+ styles, 4K quality. Try free today!",
    images: ["/twitter-image.png"],
    creator: "@petpx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get all structured data schemas
  const schemas = getStructuredData()

  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organizationSchema) }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.websiteSchema) }}
        />
        
        {/* Service Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.serviceSchema) }}
        />
        
        {/* Product Schemas - All Three Plans */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.productStarterSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.productProSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.productMaxSchema) }}
        />
        
        {/* Pet Species List Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.petSpeciesSchema) }}
        />
        
        {/* Art Styles List Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.artStylesSchema) }}
        />
        
        {/* Backgrounds List Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.backgroundsSchema) }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VisitorTrackingProvider />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
