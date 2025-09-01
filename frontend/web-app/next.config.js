/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages için base path
  basePath: process.env.NODE_ENV === 'production' ? '/emlakos-turkiye' : '',
  // Asset prefix
  assetPrefix: process.env.NODE_ENV === 'production' ? '/emlakos-turkiye' : '',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.test',
  },
}

module.exports = nextConfig
