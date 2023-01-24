/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    minimumCacheTTL: 31536000
  },
  env: {
    OASIS_GUI_PATH: process.env.OASIS_GUI_PATH,
    OASIS_API_KEY: process.env.OASIS_API_KEY,
    NEXT_PUBLIC_OASIS_API_PATH: process.env.NEXT_PUBLIC_OASIS_API_PATH,

    ORY_SDK_URL: process.env.ORY_SDK_URL,

    WEB_CHAT_API_KEY: process.env.WEB_CHAT_API_KEY,
    WEB_CHAT_HTTP_PATH: process.env.WEB_CHAT_HTTP_PATH,
    WEB_CHAT_WS_PATH: process.env.WEB_CHAT_WS_PATH,
    NEXT_PUBLIC_WEBSOCKET_PATH: process.env.NEXT_PUBLIC_WEBSOCKET_PATH,
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