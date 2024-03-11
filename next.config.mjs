/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["assets.instabridge.io", "assets.radixdlt.com"],
  },
};

export default nextConfig;
