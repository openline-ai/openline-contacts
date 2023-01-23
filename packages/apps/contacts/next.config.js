/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 31536000,
},
  env: {
    CUSTOMER_OS_API_PATH: process.env.CUSTOMER_OS_API_PATH,
    CUSTOMER_OS_API_KEY: process.env.CUSTOMER_OS_API_KEY,

    SETTINGS_API_PATH: process.env.SETTINGS_API_PATH,
    SETTINGS_API_KEY: process.env.SETTINGS_API_KEY,

    OASIS_GUI_PATH: process.env.OASIS_GUI_PATH,

    ORY_SDK_URL: process.env.ORY_SDK_URL,

    WEB_CHAT_API_KEY:process.env.WEB_CHAT_API_KEY,
    WEB_CHAT_HTTP_PATH:process.env.WEB_CHAT_HTTP_PATH,
    WEB_CHAT_WS_PATH: process.env.WEB_CHAT_WS_PATH,

    WEB_CHAT_TRACKER_ENABLED: process.env.WEB_CHAT_TRACKER_ENABLED,
    WEB_CHAT_TRACKER_APP_ID: process.env.WEB_CHAT_TRACKER_APP_ID,
    WEB_CHAT_TRACKER_ID: process.env.WEB_CHAT_TRACKER_ID,
    WEB_CHAT_TRACKER_COLLECTOR_URL: process.env.WEB_CHAT_TRACKER_COLLECTOR_URL,
    WEB_CHAT_TRACKER_BUFFER_SIZE: process.env.WEB_CHAT_TRACKER_BUFFER_SIZE,
    WEB_CHAT_TRACKER_MINIMUM_VISIT_LENGTH: process.env.WEB_CHAT_TRACKER_MINIMUM_VISIT_LENGTH,
    WEB_CHAT_TRACKER_HEARTBEAT_DELAY: process.env.WEB_CHAT_TRACKER_HEARTBEAT_DELAY,
  },
  output: 'standalone'
}

module.exports = nextConfig