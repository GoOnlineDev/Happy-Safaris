import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = `${formatTitle(params.slug)} – Uganda Safari Destination`;
  const description = `${formatTitle(params.slug)} travel guide: wildlife, attractions, best time to visit, and tours in Uganda.`;
  return {
    title,
    description,
    alternates: { canonical: `/destinations/${params.slug}` },
    openGraph: {
      title,
      description,
      url: `/destinations/${params.slug}`,
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


