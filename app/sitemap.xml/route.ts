import { NextResponse } from 'next/server';

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
  // Example dynamic pages (replace with real slugs/IDs)
  const destinationPages = ['destinations/mt-elgon', 'destinations/2'];
  const tourPages = ['tours/1', 'tours/2'];

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
    },
  });
} 