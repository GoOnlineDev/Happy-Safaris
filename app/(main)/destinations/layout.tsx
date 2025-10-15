import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Explore Uganda’s best safari destinations: Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Kidepo and more. Wildlife, gorillas, chimps, and landscapes.',
  alternates: { canonical: '/destinations' },
  openGraph: {
    title: 'Uganda Safari Destinations',
    description:
      'Explore Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Kidepo and more.',
    url: '/destinations',
    type: 'website',
    images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uganda Safari Destinations',
    description:
      'Explore Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Kidepo and more.',
    images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


