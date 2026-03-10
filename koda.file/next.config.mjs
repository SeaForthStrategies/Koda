/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14: externalize nodemailer for serverless
  experimental: {
    serverComponentsExternalPackages: ["nodemailer"],
  },
};

export default nextConfig;
