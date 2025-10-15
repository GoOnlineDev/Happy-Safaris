import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function GET() {
  // Static routes only; dynamic entries should be added once real slugs are available
  const staticPages = [
    '/',
    '/about',
    '/contact',
    '/destinations',
    '/tours',
    '/terms',
    '/tours/thank-you',
  ];

  const baseUrl = siteConfig.url ?? 'https://www.happyafricansafaris.com';
  const urls = staticPages
    .map((path) => {
      const loc = path === '/' ? baseUrl : `${baseUrl}${path}`;
      return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
    })
    .join('');

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