const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    return {
      ...config,
      // webpack: {
      //   configure: {
      //     resolve: {
      //       alias: {
      //         // ignore the cut down browser distribution that
      //         // joi's package.json steers webpack to
      //         joi: path.resolve(__dirname, 'node_modules/joi/lib/index.js'),
      //       },
      //     },
      //   },
      // }

    }
  }
}

// next.config.js
const removeImports = require("next-remove-imports")();
module.exports = removeImports(nextConfig);
