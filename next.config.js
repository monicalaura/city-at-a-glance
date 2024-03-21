/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["d13k13wj6adfdf.cloudfront.net"],
  },
};

module.exports = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Allow all origins
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
