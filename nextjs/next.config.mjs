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
        protocol: "https",
        hostname: "solstice-api.kro.kr",
        port: "5000",
        pathname: "/api/image/**",
      },
    ],
    domains: ["solstice-api.kro.kr"],
  },
};

export default nextConfig;
