/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_PATH: process.env.API_PATH
  },
  output: 'standalone'
}

module.exports = nextConfig
