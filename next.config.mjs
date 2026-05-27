/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  serverExternalPackages: ['@prisma/client', '@libsql/client', '@prisma/adapter-libsql'],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/.prisma/**/*'],
    },
  },
};

export default nextConfig;
