export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.happyafricansafaris.com';
  const now = new Date();

  const routes: Array<{ path: string; changefreq: string; priority: string }> = [
    { path: '', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.7' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
    { path: '/destinations', changefreq: 'weekly', priority: '0.8' },
    { path: '/tours', changefreq: 'weekly', priority: '0.9' },
    { path: '/terms', changefreq: 'yearly', priority: '0.3' },
    { path: '/tours/thank-you', changefreq: 'yearly', priority: '0.1' },
  ];

  const urls = routes
    .map(({ path, changefreq, priority }) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${now.toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

