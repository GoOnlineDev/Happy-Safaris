import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Happy African Safaris – Plan Your Uganda Safari',
  description:
    'Contact our Uganda safari specialists for gorilla trekking permits, wildlife tours, custom itineraries, and travel advice.',
  alternates: { canonical: '/contact' },
  keywords: [
    'Contact Uganda safari operator',
    'Book Uganda gorilla trekking',
    'Uganda safari prices',
    'East Africa safari enquiry',
  ],
  openGraph: {
    title: 'Contact Happy African Safaris – Plan Your Uganda Safari',
    description:
      'Talk to local experts about gorilla trekking, Big Five safaris, and tailor‑made East Africa tours.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


