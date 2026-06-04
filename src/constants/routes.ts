export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: (userId: string) => `/profile/${userId}`,
  EXPLORE: '/explore',
} as const;