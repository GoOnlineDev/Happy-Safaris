import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Happy African Safaris – Local Uganda Safari Experts',
  description:
    'Learn about Happy African Safaris, a trusted Uganda tour operator offering gorilla trekking, wildlife safaris, and tailor‑made East Africa tours.',
  alternates: { canonical: '/about' },
  keywords: [
    'About Uganda safari company',
    'Uganda tour operator',
    'About Happy African Safaris',
    'East Africa travel experts',
  ],
  openGraph: {
    title: 'About Happy African Safaris – Local Uganda Safari Experts',
    description:
      'We are a local team crafting unforgettable gorilla and wildlife safaris across Uganda and East Africa.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


