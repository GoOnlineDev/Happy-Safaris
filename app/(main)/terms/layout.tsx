import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read booking terms & conditions for Happy African Safaris: payments, cancellations, itinerary changes, and travel insurance.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


