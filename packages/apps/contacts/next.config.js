/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOMER_OS_API_PATH: process.env.CUSTOMER_OS_API_PATH,
    CUSTOMER_OS_API_KEY: process.env.CUSTOMER_OS_API_KEY,

    OASIS_GUI_PATH: process.env.OASIS_GUI_PATH,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_OAUTH_CLIENT_ID: process.env.NEXTAUTH_OAUTH_CLIENT_ID,
    NEXTAUTH_OAUTH_CLIENT_SECRET: process.env.NEXTAUTH_OAUTH_CLIENT_SECRET,
    NEXTAUTH_OAUTH_TENANT_ID: process.env.NEXTAUTH_OAUTH_TENANT_ID,
    NEXTAUTH_OAUTH_SERVER_URL: process.env.NEXTAUTH_OAUTH_SERVER_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  output: 'standalone'
}

module.exports = nextConfig