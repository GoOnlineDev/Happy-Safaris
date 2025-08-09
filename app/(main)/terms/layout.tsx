import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions – Happy African Safaris',
  description:
    'Read booking terms & conditions for Happy African Safaris: payments, cancellations, itinerary changes, and travel insurance.',
  alternates: { canonical: '/terms' },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


