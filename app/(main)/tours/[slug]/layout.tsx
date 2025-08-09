import type { Metadata } from 'next';

type ParamsPromise = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ParamsPromise): Promise<Metadata> {
  const { slug } = await params;
  const name = formatTitle(slug);
  const title = `${name} – Uganda Safari Itinerary & Price`;
  const description = `See the full itinerary, inclusions and price for ${name}. Book gorilla trekking and wildlife safaris with local Uganda experts.`;
  return {
    title,
    description,
    alternates: { canonical: `/tours/${slug}` },
    openGraph: {
      title,
      description,
      url: `/tours/${slug}`,
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


