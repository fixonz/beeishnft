/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add a resolve alias for the problematic module
    config.resolve.alias = {
      ...config.resolve.alias,
      '@radix-ui/react-use-effect-event': './components/radix-patched/use-effect-event.tsx',
    };
    
    return config;
  },
};

export default nextConfig;
