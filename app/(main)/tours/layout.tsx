import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Happy African Safaris | Uganda Safari Tours & Gorilla Trekking Packages',
  description:
    'Browse top Uganda safari tours: gorilla trekking, wildlife game drives, Nile cruises, and tailor‑made itineraries. Small group and private tours.',
  alternates: { canonical: '/tours' },
  keywords: [
    'Happy African Safaris',
    'Uganda safari tours',
    'gorilla trekking packages',
    'Uganda tour packages',
    'East Africa safari packages',
    'Luxury Uganda safaris',
    'Budget safaris Uganda',
    'Tailor made safaris',
    'Kibale chimpanzee trekking',
    'Kidepo Valley National Park',
    'Lake Mburo National Park',
    'Big Five safaris',
    'Serengeti and Masai Mara',
    'Rwanda gorilla trekking',
    'Luxury safari Uganda',
    'Budget safari Uganda',
    'Kampala tour operator',
    'Tailor made safaris',
  ],
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


