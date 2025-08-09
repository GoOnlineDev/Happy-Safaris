import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Uganda Safari Destinations – Parks, Reserves & Gorilla Habitats',
  description:
    'Explore Uganda’s best safari destinations: Bwindi, Murchison Falls, Queen Elizabeth, Kibale, Kidepo and more. Wildlife, gorillas, chimps, and landscapes.',
  alternates: { canonical: '/destinations' },
  keywords: [
    'Uganda safari destinations',
    'Bwindi Impenetrable National Park',
    'Murchison Falls National Park',
    'Queen Elizabeth National Park',
    'Kidepo Valley National Park',
    'Kibale Forest chimpanzees',
    'Lake Mburo National Park',
  ],
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


