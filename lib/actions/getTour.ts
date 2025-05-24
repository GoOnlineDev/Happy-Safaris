import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getTour(slug: string) {
  try {
    const tour = await convex.query(api.tours.getBySlug, { slug });
    return tour;
  } catch (error) {
    console.error("Error fetching tour:", error);
    return null;
  }
} 