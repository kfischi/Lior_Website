/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary via a custom loader (modern approach — no legacy `cloudinary` config block).
    // Every <Image> in the app is served through src/lib/cloudinary-loader.ts.
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },
  async headers() {
    // Baseline hardening headers. Tighten CSP per-deployment if needed.
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
