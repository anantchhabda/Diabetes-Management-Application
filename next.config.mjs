/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable LightningCSS (it breaks Vercel Linux builds)
  compiler: {
    lightningcss: false,
  },
  experimental: {
    optimizeCss: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
