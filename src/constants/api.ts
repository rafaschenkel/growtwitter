if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL não está definida. Por favor, configure o arquivo .env com a URL da API.'
  );
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (userId: string) => `/users/${userId}`,
    TWEETS: (userId: string) => `/users/${userId}/tweets`,
    FEED: '/users/feed',
  },
  TWEETS: {
    CREATE: '/tweets',
    BY_ID: (tweetId: string) => `/tweets/${tweetId}`,
    LIKE: (tweetId: string) => `/tweets/${tweetId}/like`,
    REPLY: (tweetId: string) => `/tweets/${tweetId}/reply`,
  },
  FOLLOWERS: {
    FOLLOW: (userId: string) => `/users/follow/${userId}`,
    UNFOLLOW: (userId: string) => `/users/unfollow/${userId}`,
    LIST: '/followers',
  },
} as const;