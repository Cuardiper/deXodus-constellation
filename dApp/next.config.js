/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io"],
  },
  //config for Biconomy?
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
