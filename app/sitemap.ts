import { MetadataRoute } from 'next'
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.happyafricansafaris.com';
  
  // Static pages
  const staticPages = [
    '',
    'about',
    'contact',
    'destinations',
    'tours',
    'terms',
    'tours/thank-you',
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  try {
    // Fetch dynamic pages from Convex
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    const [destinations, tours] = await Promise.all([
      convex.query(api.destinations.getAll),
      convex.query(api.tours.getAll),
    ]);

    // Dynamic destination pages
    const destinationPages = destinations?.map((dest: any) => ({
      url: `${baseUrl}/destinations/${dest.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    // Dynamic tour pages
    const tourPages = tours?.map((tour: any) => ({
      url: `${baseUrl}/tours/${tour.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    return [...staticPages, ...destinationPages, ...tourPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if Convex query fails
    return staticPages;
  }
}
