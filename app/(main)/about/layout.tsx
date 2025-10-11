import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Happy African Safaris, a trusted Uganda tour operator offering gorilla trekking, wildlife safaris, and tailor‑made Uganda Africa tours.',

};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


