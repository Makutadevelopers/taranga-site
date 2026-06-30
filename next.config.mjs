/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static HTML export (deploys to Netlify / Cloudflare Pages like today)
  trailingSlash: true,        // emit /about/index.html so clean URLs work on static hosts
  images: { unoptimized: true }, // no image optimization server in a static export
  reactStrictMode: true,
};

export default nextConfig;
