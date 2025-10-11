import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact our Uganda safari specialists for gorilla trekking permits, wildlife tours, custom itineraries, and travel advice.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


