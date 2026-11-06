/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Cloudinary via a custom loader (modern approach — no legacy config block).
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },
  // The two pages that were merged into "torts" keep working for old links and search results.
  async redirects() {
    // One address for the site: the www version and any old domains send visitors (and Google) to SITE_URL.
    // REDIRECT_FROM_HOSTS is a comma-separated list of old hosts, for example "old-name.com,www.old-name.com".
    const site = process.env.SITE_URL ? new URL(process.env.SITE_URL) : null;
    const hostRedirects = site
      ? [
          ...(site.hostname.startsWith('www.') ? [] : [`www.${site.hostname}`]),
          ...(process.env.REDIRECT_FROM_HOSTS ?? '').split(',').map((h) => h.trim()),
        ]
          .filter((host) => host && host !== site.hostname)
          .map((host) => ({
            source: '/:path*',
            has: [{ type: 'host', value: host }],
            destination: `${site.origin}/:path*`,
            permanent: true,
          }))
      : [];
    return [
      ...hostRedirects,
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
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), payment=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
