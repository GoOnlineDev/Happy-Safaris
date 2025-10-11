/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export to allow Clerk auth to work properly
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // Not needed when not using static export
    domains: ['images.unsplash.com', 'img.clerk.com', 'utfs.io'],
  },
  async redirects() {
    return [
      // Redirect HTTP to HTTPS
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
      // Redirect non-WWW to WWW
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "undici": false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
