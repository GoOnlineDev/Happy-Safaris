import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Explore Uganda’s best safari destinations: Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Kidepo and more. Wildlife, gorillas, chimps, and landscapes.',

};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


