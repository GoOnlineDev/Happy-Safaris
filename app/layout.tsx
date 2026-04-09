import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Lora, Inter } from 'next/font/google';
import { Providers } from '@/components/providers/Providers';
import { cn } from "@/lib/utils";
import Script from 'next/script';
import { siteConfig } from '@/lib/config';

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


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url ?? 'https://happyafricansafaris.com'),
  title: {
    default: 'Happy African Safaris ',
    template: '%s | Happy African Safaris - Uganda Safari Tours',
  },
  description:
    'Happy African Safaris - Top-rated Uganda safaris: gorilla trekking in Bwindi, Big Five game drives, Murchison Falls, Kibale chimps, tailor‑made tours across Uganda, Rwanda, Kenya & Tanzania.',
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
    siteName: siteConfig.name,
    title: 'Happy African Safaris – Uganda Safari Tours',
    description:
      'Top-rated Uganda safaris: gorilla trekking, Big Five, tailor‑made tours across Uganda, Rwanda, Kenya & Tanzania.',
    url: '/',
    images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }]: undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy African Safaris – Uganda Safari Tours',
    description:
      'Top-rated Uganda safaris: gorilla trekking, Big Five, tailor‑made tours across Uganda, Rwanda, Kenya & Tanzania.',
    images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
    creator: '@happyafricansafaris',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/logo.png' }],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={cn(
        inter.className,
        playfair.variable,
        lora.variable
      )}>
        <Providers>
          {/* JSON-LD: Organization and Website */}
          <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url ?? 'https://happyafricansafaris.com',
              logo: siteConfig.url ? siteConfig.url + '/logo.png' : 'https://www.happyafricansafaris.com/logo.png',
              sameAs: [siteConfig.links.twitter, siteConfig.links.github].filter(Boolean),
              contactPoint: [{
                '@type': 'ContactPoint',
                contactType: 'customer support',
                availableLanguage: ['en'],
              }],
            })}
          </Script>
          <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url ?? 'https://happyafricansafaris.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteConfig.url ?? 'https://happyafricansafaris.com'}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            })}
          </Script>

          <main >
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}