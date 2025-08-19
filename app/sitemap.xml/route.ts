import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function GET() {
  // In a real app, fetch slugs/IDs for dynamic pages from your DB
  const staticPages = [
    '',
    'about',
    'contact',
    'destinations',
    'tours',
    'terms',
    'tours/thank-you',
  ];

  try {
    // Fetch dynamic pages from Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    const [destinations, tours] = await Promise.all([
      convex.query(api.destinations.getAll),
      convex.query(api.tours.getAll),
    ]);

    // Example dynamic pages (replace with real slugs/IDs)
    const destinationPages = destinations?.map((dest: any) => `destinations/${dest.slug}`) || [];
    const tourPages = tours?.map((tour: any) => `tours/${tour.slug}`) || [];

    const allPages = [
      ...staticPages,
      ...destinationPages,
      ...tourPages,
    ];

    const baseUrl = 'https://www.happyafricansafaris.com';
    const urls = allPages.map(
      (path) =>
        `<url><loc>${baseUrl}/${path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only if Convex query fails
    const baseUrl =  'https://www.happyafricansafaris.com';
    const urls = staticPages.map(
      (path) =>
        `<url><loc>${baseUrl}/${path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
    ).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

