import type { Metadata } from 'next';
import { getDestination } from '@/lib/actions/getDestination';
import { siteConfig } from '@/lib/config';

type ParamsPromise = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ParamsPromise): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);
  
  const baseUrl = siteConfig.url ?? 'https://www.happyafricansafaris.com';
  
  // Fallback metadata if destination not found
  if (!destination) {
    const title = `${formatTitle(slug)} – Uganda Safari Destination`;
    const description = `${formatTitle(slug)} travel guide: wildlife, attractions, best time to visit, and tours in Uganda.`;
    return {
      title,
      description,
      alternates: { canonical: `${baseUrl}/destinations/${slug}` },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/destinations/${slug}`,
      },
    };
  }

  // Generate metadata from real destination data
  const title = `${destination.name} – Uganda Safari Destination | Happy African Safaris`;
  const description = destination.description
    ? `${destination.description.substring(0, 155)}${destination.description.length > 155 ? '...' : ''}`
    : `Visit ${destination.name} in ${destination.country}. Discover wildlife, attractions, best time to visit, and book tours with Happy African Safaris.`;
  
  const images = destination.imageUrl && destination.imageUrl.length > 0
    ? destination.imageUrl.map(img => ({
        url: img.startsWith('http') ? img : `${baseUrl}${img}`,
        alt: destination.name,
      }))
    : siteConfig.ogImage ? [{ url: siteConfig.ogImage }] : undefined;

  const keywords = [
    destination.name,
    `${destination.name} Uganda`,
    `${destination.country} safari`,
    'Uganda destinations',
    'East Africa travel',
    ...(destination.attractions || []).slice(0, 3),
  ];

  return {
    title,
    description,
    keywords,
    alternates: { 
      canonical: `${baseUrl}/destinations/${destination.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/destinations/${destination.slug}`,
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

export default function DestinationSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function formatTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


