/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      { source: '/how-it-works', destination: '/services/chef-on-demand/', permanent: true },
      { source: '/parlor', destination: '/parlor-kc/', permanent: true },
      { source: '/cumin-chicken', destination: '/parlor-kc/', permanent: true },
      { source: '/pies', destination: '/parlor-kc/', permanent: true },
      { source: '/in-the-press', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
