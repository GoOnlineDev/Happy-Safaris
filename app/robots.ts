import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

const baseUrl = siteConfig.url ?? "https://happyafricansafaris.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal/",
          "/api/",
          "/login/",
          "/signup/",
          "/tours/thank-you/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/portal/",
          "/api/",
          "/login/",
          "/signup/",
          "/tours/thank-you/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
