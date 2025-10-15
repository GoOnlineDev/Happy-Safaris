import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact our Uganda safari specialists for gorilla trekking permits, wildlife tours, custom itineraries, and travel advice.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Happy African Safaris',
    description:
      'Speak to safari specialists for gorilla permits, wildlife tours, and tailor‑made itineraries.',
    url: '/contact',
    type: 'website',
    images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Happy African Safaris',
    description:
      'Safari specialists for gorilla permits, wildlife tours, tailor‑made trips.',
    images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


