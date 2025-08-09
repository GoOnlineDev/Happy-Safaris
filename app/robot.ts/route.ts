export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.happyafricansafaris.com';
  const content = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
Host: ${siteUrl}
`;
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

