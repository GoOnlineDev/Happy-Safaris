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
