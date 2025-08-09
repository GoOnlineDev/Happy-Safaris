import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = formatTitle(params.slug);
  const title = `${name} – Uganda Safari Itinerary & Price`;
  const description = `See the full itinerary, inclusions and price for ${name}. Book gorilla trekking and wildlife safaris with local Uganda experts.`;
  return {
    title,
    description,
    alternates: { canonical: `/tours/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/tours/${params.slug}`,
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


