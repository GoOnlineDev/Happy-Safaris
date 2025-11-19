import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export async function GET() {
  const baseUrl = siteConfig.url ?? 'https://www.happyafricansafaris.com';

  // Static pages
  const staticPages = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    { path: '/destinations', priority: '0.9', changefreq: 'weekly' },
    { path: '/tours', priority: '0.9', changefreq: 'weekly' },
    { path: '/terms', priority: '0.5', changefreq: 'yearly' },
  ];

  // Fetch dynamic tours and destinations using server-side fetchQuery
  let tours: any[] = [];
  let destinations: any[] = [];

  try {
    tours = await fetchQuery(api.tours.getAll, {});
  } catch (error: any) {
    console.error('Error fetching tours for sitemap:', error?.message || error);
  }

  try {
    destinations = await fetchQuery(api.destinations.getAll, {});
  } catch (error: any) {
    console.error('Error fetching destinations for sitemap:', error?.message || error);
  }

  // Build static URLs
  const staticUrls = staticPages
    .map(({ path, priority, changefreq }) => {
      const loc = path === '/' ? baseUrl : `${baseUrl}${path}`;
      return `<url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('');

  // Build tour URLs
  const tourUrls = tours
    .map((tour) => {
      const loc = `${baseUrl}/tours/${tour.slug}`;
      // Use lastModified from updatedAt if available
      const lastmod = tour.updatedAt
        ? new Date(tour.updatedAt).toISOString().split('T')[0]
        : undefined;
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.9</priority>${lastmodTag}</url>`;
    })
    .join('');

  // Build destination URLs
  const destinationUrls = destinations
    .map((destination) => {
      const loc = `${baseUrl}/destinations/${destination.slug}`;
      const lastmod = destination.updatedAt
        ? new Date(destination.updatedAt).toISOString().split('T')[0]
        : undefined;
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      return `<url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>0.8</priority>${lastmodTag}</url>`;
    })
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${tourUrls}
${destinationUrls}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}