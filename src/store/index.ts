import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@/store/api/apiSlice';
import authReducer from '@/store/slices/authSlice';
import tweetReducer from '@/store/slices/tweetSlice';
import userReducer from '@/store/slices/userSlice';
import themeReducer from '@/store/slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
    users: userReducer,
    theme: themeReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;