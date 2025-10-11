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


export const metadata: Metadata = {
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
        <Providers>

          <main >
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}