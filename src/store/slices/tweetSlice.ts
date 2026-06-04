import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Tweet, TweetDraft } from '@/types';

interface TweetState {
  tweets: Tweet[];
  currentTweet: Tweet | null;
  isLoading: boolean;
  error: string | null;
  draft: TweetDraft | null;
}

const initialState: TweetState = {
  tweets: [],
  currentTweet: null,
  isLoading: false,
  error: null,
  draft: null,
};

const tweetSlice = createSlice({
  name: 'tweets',
  initialState,
  reducers: {
    fetchTweetsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchTweetsSuccess: (state, action: PayloadAction<Tweet[]>) => {
      state.isLoading = false;
      state.tweets = action.payload;
      state.error = null;
    },
    fetchTweetsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addTweet: (state, action: PayloadAction<Tweet>) => {
      state.tweets.unshift(action.payload);
    },
    updateTweet: (state, action: PayloadAction<Tweet>) => {
      const index = state.tweets.findIndex(
        (tweet) => tweet.id === action.payload.id
      );
      if (index !== -1) {
        state.tweets[index] = action.payload;
      }
      if (state.currentTweet?.id === action.payload.id) {
        state.currentTweet = action.payload;
      }
    },
    setCurrentTweet: (state, action: PayloadAction<Tweet | null>) => {
      state.currentTweet = action.payload;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const tweet = state.tweets.find((t) => t.id === action.payload);
      if (tweet) {
        tweet.isLiked = !tweet.isLiked;
        tweet._count.likes += tweet.isLiked ? 1 : -1;
      }
      if (state.currentTweet?.id === action.payload) {
        state.currentTweet.isLiked = !state.currentTweet.isLiked;
        state.currentTweet._count.likes += state.currentTweet.isLiked ? 1 : -1;
      }
    },
    saveDraft: (state, action: PayloadAction<TweetDraft>) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTweets: (state) => {
      state.tweets = [];
    },
  },
});

export const {
  fetchTweetsStart,
  fetchTweetsSuccess,
  fetchTweetsFailure,
  addTweet,
  updateTweet,
  setCurrentTweet,
  toggleLike,
  saveDraft,
  clearDraft,
  clearError,
  resetTweets,
} = tweetSlice.actions;

export default tweetSlice.reducer;
