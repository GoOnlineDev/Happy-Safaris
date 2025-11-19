import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Fetch destination by slug from Convex using server-side fetchQuery
 * This is the recommended way to query Convex in Next.js server components
 */
export async function getDestination(slug: string) {
  try {
    const destination = await fetchQuery(api.destinations.getBySlug, { slug });
    return destination;
  } catch (error: any) {
    // Silently fail - fallback metadata will be used
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getDestination] Failed to fetch destination "${slug}":`, error?.message || 'Unknown error');
    }
    return null;
  }
}

