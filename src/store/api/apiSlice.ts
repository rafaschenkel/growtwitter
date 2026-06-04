import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import type { RootState } from '@/store/index';
import { API_BASE_URL } from '@/constants/api';
import { logout } from '@/store/slices/authSlice';

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  if (result.data && typeof result.data === 'object' && 'data' in result.data) {
    return { ...result, data: (result.data as any).data };
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Tweet', 'Feed', 'Auth'],
  endpoints: () => ({}),
});

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'Feed'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const tweetApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query({
      query: () => '/users/feed',
      providesTags: ['Feed', 'Tweet'],
    }),
    getTweetById: builder.query({
      query: (tweetId) => `/tweets/${tweetId}`,
      providesTags: (_result, _error, tweetId) => [
        { type: 'Tweet', id: tweetId },
      ],
    }),
    createTweet: builder.mutation({
      query: (tweetData) => ({
        url: '/tweets',
        method: 'POST',
        body: tweetData,
      }),
      invalidatesTags: ['Feed', 'Tweet'],
    }),
    createReply: builder.mutation({
      query: ({ tweetId, content }) => ({
        url: `/tweets/${tweetId}/reply`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Feed', 'Tweet', 'User'],
    }),
    likeTweet: builder.mutation({
      query: (tweetId) => ({
        url: `/tweets/${tweetId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, tweetId) => [
        'Feed',
        'Tweet',
        'User',
        { type: 'Tweet', id: tweetId },
      ],
    }),
    unlikeTweet: builder.mutation({
      query: (tweetId) => ({
        url: `/tweets/${tweetId}/like`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, tweetId) => [
        'Feed',
        'Tweet',
        'User',
        { type: 'Tweet', id: tweetId },
      ],
    }),
  }),
});

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        'Tweet',
      ],
    }),
    getUserTweets: builder.query({
      query: (userId) => `/users/${userId}/tweets`,
      providesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        'Tweet',
      ],
    }),
    getFollowers: builder.query({
      query: () => '/followers',
      providesTags: ['User', 'Auth'],
    }),
    followUser: builder.mutation({
      query: (userId) => ({
        url: `/users/follow/${userId}`,
        method: 'POST',
        body: {}, // API espera um body, mesmo que vazio
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
        'User',
        'Feed',
        'Auth',
      ],
      // Força refetch do usuário logado após follow
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalida cache do usuário logado para forçar refetch
          dispatch(
            apiSlice.util.invalidateTags([
              { type: 'User', id: userId },
              'Auth',
            ])
          );
        } catch {}
      },
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/users/follow/${userId}`,
        method: 'DELETE',
        // DELETE não precisa de body
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: 'User', id: userId },
        { type: 'User', id: 'LIST' },
        'User',
        'Feed',
        'Auth',
      ],
      // Força refetch do usuário logado após unfollow
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalida cache do usuário logado para forçar refetch
          dispatch(
            apiSlice.util.invalidateTags([
              { type: 'User', id: userId },
              'Auth',
            ])
          );
        } catch {}
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

export const {
  useGetFeedQuery,
  useGetTweetByIdQuery,
  useCreateTweetMutation,
  useCreateReplyMutation,
  useLikeTweetMutation,
  useUnlikeTweetMutation,
} = tweetApi;

export const {
  useGetUserByIdQuery,
  useGetUserTweetsQuery,
  useGetFollowersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = userApi;
