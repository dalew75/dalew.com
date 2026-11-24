/** @type {import('next').NextConfig} */
const nextConfig = {
  // droplet site-deploy (SIDE_BUILD=1) builds into .next-a/.next-b while the live server keeps the other one
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
