/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // For PWA support, if you plan to use next-pwa plugin
    modern: true
  },
  i18n: {
    locales: ['eng', 'nep'],
    defaultLocale: 'eng',
  },
};

export default nextConfig;
