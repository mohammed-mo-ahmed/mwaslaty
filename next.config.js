/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['firebase-admin'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com'
      }
    ]
  }
};

module.exports = withNextIntl(nextConfig);
