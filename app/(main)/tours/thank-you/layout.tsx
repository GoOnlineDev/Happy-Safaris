import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Received – Thank You | Happy African Safaris',
  description:
    'Thanks for booking with Happy African Safaris. Our team will contact you with confirmation and next steps.',
  robots: { index: true, follow: false },
  alternates: { canonical: '/tours/thank-you' },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


