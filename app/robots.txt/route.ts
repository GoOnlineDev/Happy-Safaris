import { NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export async function GET() {
  const baseUrl = siteConfig.url ?? 'https://www.happyafricansafaris.com';
  const content = `User-agent: *
Allow: /
Disallow: /portal
Disallow: /profile
Disallow: /inbox
Disallow: /api
Sitemap: ${baseUrl}/sitemap.xml
`;
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 