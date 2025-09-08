import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
  // Add production optimizations
  webpack: (config, { isServer, dev }) => {
    // Only apply to client-side builds in production
    if (!dev && !isServer) {
      // Ensure proper minification settings
      if (config.optimization && config.optimization.minimizer) {
        config.optimization.minimizer = config.optimization.minimizer.map((minimizer: any) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              keep_fnames: true, // Keep function names to prevent minification issues
              mangle: {
                reserved: ['onSubmitWithImages'], // Reserve specific function names
              },
            };
          }
          return minimizer;
        });
      }
    }
    
    return config;
  },
  // Ensure proper environment variables are available
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    PREVIEW_DOMAIN: process.env.PREVIEW_DOMAIN || 'localhost:3000',
  },
};

export default nextConfig;