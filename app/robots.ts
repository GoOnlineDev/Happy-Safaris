import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal', '/api', '/dashboard'],
    },
    sitemap: 'https://www.happyafricansafaris.com/sitemap.xml',
    host: 'https://www.happyafricansafaris.com',
  }
}
