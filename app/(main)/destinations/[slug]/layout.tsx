import type { Metadata } from 'next';

type ParamsPromise = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ParamsPromise): Promise<Metadata> {
  const { slug } = await params;
  const title = `${formatTitle(slug)} – Uganda Safari Destination`;
  const description = `${formatTitle(slug)} travel guide: wildlife, attractions, best time to visit, and tours in Uganda.`;
  return {
    title,
    description,
    alternates: { canonical: `/destinations/${slug}` },
    openGraph: {
      title,
      description,
      url: `/destinations/${slug}`,
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


