import type { BaseTweet, BaseUser } from '@/types/base';

export interface Tweet extends BaseTweet {
  user: User;
  parentTweet?: Tweet;
  replies?: Tweet[];
}

export interface User extends BaseUser {
  followers?: Array<{ follower: User }>;
  following?: Array<{ following: User }>;
  tweets?: Tweet[];
}

export interface UserProfile extends User {
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserInteractionState {
  isFollowing: boolean;
  isBlocked: boolean;
  isMuted: boolean;
}

export interface UserStats {
  tweetsCount: number;
  followersCount: number;
  followingCount: number;
  likesCount: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
}

export interface UserSearchResult {
  id: string;
  name: string;
  username: string;
  imgUrl?: string;
}

export interface FollowAction {
  userId: string;
  action: 'follow' | 'unfollow';
  timestamp: string;
}

export interface UserListItem {
  id: string;
  name: string;
  username: string;
  imgUrl?: string;
  isFollowing: boolean;
}

export interface AvatarData {
  initials: string;
  backgroundColor: string;
  color: string;
}
