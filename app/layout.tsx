import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lora, Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { cn } from "@/lib/utils";
import Script from 'next/script';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#1a2421',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
  interactiveWidget: 'resizes-visual',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.happyafricansafaris.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Happy African Safaris | Uganda Gorilla Trekking & East Africa Tours',
    template: '%s | Happy African Safaris',
  },
  description:
    'Top-rated Uganda safaris: gorilla trekking in Bwindi, Big Five game drives, Murchison Falls, Kibale chimps, tailor‑made tours across Uganda, Rwanda, Kenya & Tanzania.',
  keywords: [
    'Happy African Safaris',
    'Uganda safaris',
    'Uganda gorilla trekking',
    'East Africa tours',
    'African safari packages',
    'Murchison Falls safari',
    'Queen Elizabeth National Park',
    'Bwindi Impenetrable National Park',
    'Kibale chimpanzee trekking',
    'Kidepo Valley National Park',
    'Lake Mburo National Park',
    'Big Five safaris',
    'Serengeti and Masai Mara',
    'Rwanda gorilla trekking',
    'Luxury safari Uganda',
    'Budget safari Uganda',
    'Kampala tour operator',
    'Tailor made safaris',
  ],
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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Happy African Safaris | Uganda Gorilla Trekking & East Africa Tours',
    description:
      'Plan your Uganda safari with local experts. Gorilla trekking, Big Five, Nile cruises, and custom East Africa itineraries.',
    siteName: 'Happy African Safaris',
    images: [
      {
        url: `${siteUrl}/og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Happy African Safaris – Uganda & East Africa Tours',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy African Safaris | Uganda Gorilla Trekking & East Africa Tours',
    description:
      'Top‑rated Uganda and East Africa safaris. Private and small‑group itineraries planned by local experts.',
    images: [`${siteUrl}/og.jpg`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'travel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.className,
        playfair.variable,
        lora.variable
      )}>
        {/* Organization JSON-LD */}
        <Script id="org-jsonld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TravelAgency',
            name: 'Happy African Safaris',
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            image: `${siteUrl}/og.jpg`,
            description:
              'Uganda safari experts offering gorilla trekking, wildlife tours, and tailor‑made East Africa itineraries.',
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'UG',
              addressLocality: 'Kampala',
            },
            sameAs: [
              'https://www.facebook.com/',
              'https://www.instagram.com/',
              'https://www.youtube.com/',
              'https://x.com/',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              email: 'info@happyafricansafaris.com',
              telephone: '+256-000-000000',
              areaServed: ['UG', 'RW', 'KE', 'TZ'],
              availableLanguage: ['en'],
            },
          })}
        </Script>
        <Providers>

          <main >
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}