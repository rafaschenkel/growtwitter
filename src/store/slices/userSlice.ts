import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, UserProfile } from '@/types';

interface UserState {
  users: User[];
  currentProfile: UserProfile | null;
  followers: User[];
  following: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentProfile: null,
  followers: [],
  following: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.isLoading = false;
      state.currentProfile = action.payload;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchFollowersSuccess: (state, action: PayloadAction<User[]>) => {
      state.followers = action.payload;
    },
    fetchFollowingSuccess: (state, action: PayloadAction<User[]>) => {
      state.following = action.payload;
    },
    toggleFollow: (state, action: PayloadAction<string>) => {
      if (state.currentProfile && state.currentProfile.id === action.payload) {
        state.currentProfile.isFollowing = !state.currentProfile.isFollowing;
        state.currentProfile._count.followers += state.currentProfile.isFollowing ? 1 : -1;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.currentProfile) {
        state.currentProfile = { ...state.currentProfile, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  fetchFollowersSuccess,
  fetchFollowingSuccess,
  toggleFollow,
  updateUserProfile,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;