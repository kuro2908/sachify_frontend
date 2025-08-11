// API Configuration
// Change this URL when port forwarding or deploying
export const API_CONFIG = {
  // For local development
  LOCAL: "http://localhost:5000",
  
  // For VS Code port forwarding (recommended)
  VS_CODE_PORT_FORWARD: "https://150fncr1-5000.asse.devtunnels.ms",
  
  // For external port forwarding tools (ngrok, cloudflared, etc.)
  PORT_FORWARD: "https://150fncr1-5000.asse.devtunnels.ms",
  
  // For production (update when deploying)
  PRODUCTION: "https://your-production-domain.com"
};

// Current active API URL
// Change this based on your setup:
// - LOCAL: for local development
// - VS_CODE_PORT_FORWARD: for VS Code port forwarding (recommended)
// - PORT_FORWARD: for external tools
// - PRODUCTION: for production deployment
export const API_BASE_URL = API_CONFIG.LOCAL;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GOOGLE_LOGIN: "/api/auth/google-login",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  STORIES: {
    BASE: "/api/stories",
    RANKINGS: "/api/stories/rankings",
    SEARCH: "/api/stories/search",
  },
  CATEGORIES: "/api/categories",
  CHAPTERS: "/api/chapters",
  USERS: "/api/users",
  COMMENTS: "/api/comments",
  BOOKMARKS: "/api/bookmarks",
  READING_HISTORY: "/api/reading-history",
  REVIEWS: "/api/reviews",
};

// Network status check endpoint
export const HEALTH_CHECK_ENDPOINT = "/api/health";
