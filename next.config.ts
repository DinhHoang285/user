import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  // react 18 about strict mode https://reactjs.org/blog/2022/03/29/react-v18.html#new-strict-mode-behaviors
  reactStrictMode: false,
  distDir: 'dist/.next',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. in development we need to run yarn lint
    ignoreDuringBuilds: true
  },
  images: {
    minimumCacheTTL: 60 * 60 * 7, // 7 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `**.${process.env.DOMAIN}`
      },
      {
        protocol: 'https',
        hostname: 'testing.helloyou.com'
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com'
      }
    ],
    domains: ['localhost', 'api.staging.helloyou.com'],
    formats: ['image/webp', 'image/avif']
  },
  experimental: {
    scrollRestoration: true
  },
  async rewrites() {
    return [{
      // default landing page is login page
      source: '/:locale',
      destination: '/:locale/login'
    }, {
      source: '/',
      destination: '/en/login' // Redirect root to default locale
    }];
  },
  // optimizeFonts: true, // Invalid next.config.js options detected
  poweredByHeader: false,
  // swcMinify: true, // Invalid next.config.js options detected
  transpilePackages: [
    'antd', '@ant-design', 'rc-collapse', 'rc-util', 'rc-input',
    'rc-pagination', 'rc-picker', 'rc-notification', 'rc-tooltip', 'rc-tree', 'rc-table'
  ],
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    MAX_SIZE_IMAGE: process.env.MAX_SIZE_IMAGE,
    MAX_SIZE_FILE: process.env.MAX_SIZE_FILE,
    MAX_SIZE_TEASER: process.env.MAX_SIZE_TEASER,
    MAX_SIZE_VIDEO: process.env.MAX_SIZE_VIDEO,
    HASH_PW_CLIENT: process.env.HASH_PW_CLIENT,
    DOMAIN: process.env.DOMAIN,
    SITE_URL: process.env.SITE_URL || `https://${process.env.DOMAIN}`,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || `${process.env.DOMAIN}-24051993`,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  }
};

export default nextConfig;
