/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
    qualities: [75, 80],
    minimumCacheTTL: 14400,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://www.happyafricansafaris.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'happyafricansafaris.com',
          },
        ],
        destination: 'https://www.happyafricansafaris.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
