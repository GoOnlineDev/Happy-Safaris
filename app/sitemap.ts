import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.happyafricansafaris.com';
  const now = new Date();

  // Known static routes. Dynamic slugs can be appended later.
  const routes = [
    '',
    '/about',
    '/contact',
    '/destinations',
    '/tours',
    '/terms',
    '/tours/thank-you',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}


