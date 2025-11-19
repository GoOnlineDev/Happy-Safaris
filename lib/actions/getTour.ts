import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Fetch tour by slug from Convex using server-side fetchQuery
 * This is the recommended way to query Convex in Next.js server components
 */
export async function getTour(slug: string) {
  try {
    const tour = await fetchQuery(api.tours.getBySlug, { slug });
    return tour;
  } catch (error: any) {
    // Silently fail - fallback metadata will be used
    // Only log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[getTour] Failed to fetch tour "${slug}":`, error?.message || 'Unknown error');
    }
    return null;
  }
} 