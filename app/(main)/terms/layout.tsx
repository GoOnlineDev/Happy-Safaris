import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read booking terms & conditions for Happy African Safaris: payments, cancellations, itinerary changes, and travel insurance.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms & Conditions – Happy African Safaris',
    description:
      'Booking terms: payments, cancellations, itinerary changes, and travel insurance.',
    url: '/terms',
    type: 'website',
    images: siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions – Happy African Safaris',
    description:
      'Booking terms: payments, cancellations, itinerary changes, and travel insurance.',
    images: siteConfig.ogImage ? [siteConfig.ogImage] : undefined,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


