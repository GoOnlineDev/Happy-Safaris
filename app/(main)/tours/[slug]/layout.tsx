import type { Metadata } from 'next';
import { getTour } from '@/lib/actions/getTour';
import { siteConfig } from '@/lib/config';

type ParamsPromise = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ParamsPromise): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  
  const baseUrl = siteConfig.url ?? 'https://www.happyafricansafaris.com';
  
  // Fallback metadata if tour not found
  if (!tour) {
    const name = formatTitle(slug);
    const title = `${name} – Uganda Safari Itinerary & Price`;
    const description = `See the full itinerary, inclusions and price for ${name}. Book gorilla trekking and wildlife safaris with local Uganda experts.`;
    return {
      title,
      description,
      alternates: { canonical: `${baseUrl}/tours/${slug}` },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/tours/${slug}`,
      },
    };
  }

  // Generate metadata from real tour data
  const title = `${tour.title} – Uganda Safari Itinerary & Price | Happy African Safaris`;
  const description = tour.description 
    ? `${tour.description.substring(0, 155)}${tour.description.length > 155 ? '...' : ''}`
    : `Book ${tour.title} - ${tour.duration} day safari in ${tour.location}, ${tour.country}. Starting from $${tour.price}.`;
  
  const images = tour.imageUrl && tour.imageUrl.length > 0
    ? tour.imageUrl.map(img => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        alt: tour.title,
      }))
    : siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined;

  return {
    title,
    description,
    keywords: [
      tour.title,
      `${tour.location} safari`,
      `${tour.country} tours`,
      'Uganda gorilla trekking',
      'East Africa safaris',
      tour.difficulty ? `${tour.difficulty} safari` : undefined,
    ].filter(Boolean) as string[],
    alternates: { 
      canonical: `${baseUrl}/tours/${tour.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/tours/${tour.slug}`,
      type: 'website',
      images,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images?.[0]?.url ? [images[0].url] : undefined,
    },
  };
}

export default function TourSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function formatTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


