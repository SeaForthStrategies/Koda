/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14: externalize nodemailer so it resolves in serverless
  experimental: {
    serverComponentsExternalPackages: ["nodemailer"],
  },
};

export default nextConfig;
