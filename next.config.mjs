/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
    allowedDevOrigins: [
    "192.168.1.9",
  ],
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
