# SEO To‑Do – Happy African Safaris

## ✅ Completed

- [x] Global metadata (title templates, keywords, Open Graph, Twitter, icons)
- [x] Robots and sitemap using Next.js app router
- [x] Per‑page metadata for About, Contact, Destinations, Tours, Terms, Thank‑you
- [x] Dynamic metadata for `tours/[slug]` and `destinations/[slug]` (using real data from Convex)
- [x] Add JSON‑LD per page:
  - [x] Root layout (Organization and Website) - ✅ Already implemented
  - [x] Destinations (TouristDestination / Place) - ✅ Implemented
  - [x] Tours (TouristTrip / Offer) - ✅ Implemented
  - [ ] About (Organization - optional, already in root layout)
  - [ ] Contact (ContactPoint - optional enhancement)
- [x] Generate dynamic sitemap entries from data source (tours & destinations slugs) - ✅ Using fetchQuery
- [x] Optimized Convex queries with proper indexes (by_slug, by_featured) - ✅ Performance improvement
- [x] Fixed server-side data fetching (using fetchQuery from convex/nextjs) - ✅ Proper implementation

## 🔄 Manual Steps (Not Code)

- [ ] Create and verify Search Console property; submit sitemap
  - Go to Google Search Console
  - Add property: https://www.happyafricansafaris.com
  - Submit sitemap: https://www.happyafricansafaris.com/sitemap.xml
- [ ] Add analytics (GA4) and conversion tracking (optional)

## 📝 Optional Enhancements

- [ ] Write unique meta descriptions for each tour and destination (currently using truncated descriptions)
- [ ] Optimize images with descriptive `alt` text and filenames (review existing images)
- [ ] Build internal linking between related tours/destinations (check if already implemented)
- [ ] Add ContactPoint JSON-LD to contact page
- [ ] Add LocalBusiness schema if you have a physical location


