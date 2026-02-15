// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // Transpile Ant Design for SSR compatibility
//   transpilePackages: ['antd', '@ant-design/icons', '@ant-design/nextjs-registry'],

//   // Experimental features
//   experimental: {
//     // Optimize package imports for better performance
//     optimizePackageImports: ['antd', '@ant-design/icons'],
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Ant Design for SSR compatibility
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "@ant-design/nextjs-registry",
    "@prisma/client",
  ],

  // Experimental features
  experimental: {
    // Optimize package imports for better performance
    optimizePackageImports: ["antd", "@ant-design/icons"],
  },

  // ✅ IMPORTANT: fix Windows + Turbopack workspace issue
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
