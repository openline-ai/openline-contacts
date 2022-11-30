/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_PATH: process.env.API_PATH,
    OASIS_GUI_PATH: process.env.OASIS_GUI_PATH
  },
  output: 'standalone'
}

module.exports = nextConfig
