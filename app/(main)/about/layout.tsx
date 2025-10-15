import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Happy African Safaris, a trusted Uganda tour operator offering gorilla trekking, wildlife safaris, and tailor‑made Uganda Africa tours.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Happy African Safaris',
    description:
      'Trusted Uganda tour operator for gorilla trekking, wildlife safaris, and tailor‑made East Africa tours.',
    url: '/about',
    type: 'website',
    images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Happy African Safaris',
    description:
      'Trusted Uganda tour operator for gorilla trekking and wildlife safaris.',
    images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


