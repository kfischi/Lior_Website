/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary via a custom loader (modern approach — no legacy config block).
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },
  // The two pages that were merged into "torts" keep working for old links and search results.
  async redirects() {
    return [
      { source: '/practice-areas/workplace-discrimination', destination: '/practice-areas/torts', permanent: true },
      { source: '/practice-areas/sexual-harassment', destination: '/practice-areas/torts', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
