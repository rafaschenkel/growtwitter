export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  },
  app: {
    name: 'GrowTwitter',
    version: '1.0.0',
    description: 'Projeto full stack III',
  },
  features: {
    enableDarkMode: true,
  },
  limits: {
    tweetMaxLength: 280,
    nameMaxLength: 50,
    usernameMaxLength: 15,
  },
} as const;