import type { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const baseUrl = siteConfig.url ?? "https://happyafricansafaris.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return staticPages;
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);

    const [tours, destinations] = await Promise.all([
      convex.query(api.tours.getAll, {}),
      convex.query(api.destinations.getAll, {}),
    ]);

    const tourPages: MetadataRoute.Sitemap = tours
      .filter((tour) => Boolean(tour?.slug))
      .map((tour) => ({
        url: `${baseUrl}/tours/${tour.slug}`,
        lastModified: new Date(tour.updatedAt ?? tour.createdAt ?? now),
        changeFrequency: "weekly",
        priority: tour.featured ? 0.9 : 0.8,
      }));

    const destinationPages: MetadataRoute.Sitemap = destinations
      .filter((destination) => Boolean(destination?.slug))
      .map((destination) => ({
        url: `${baseUrl}/destinations/${destination.slug}`,
        lastModified: new Date(
          destination.updatedAt ?? destination.createdAt ?? now
        ),
        changeFrequency: "weekly",
        priority: destination.featured ? 0.85 : 0.75,
      }));

    return [...staticPages, ...tourPages, ...destinationPages];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticPages;
  }
}
