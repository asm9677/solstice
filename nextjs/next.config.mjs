const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "http",
        hostname: "141.164.44.11",
        port: "5000",
        pathname: "/api/image/**",
      },
    ],
    domains: ["141.164.44.11"],
  },
};

export default nextConfig;
