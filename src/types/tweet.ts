import type { BaseTweet } from '@/types/base';
import type { User } from '@/types/user';

export interface Tweet extends BaseTweet {
  user: User;
  parentTweet?: Tweet;
  replies?: Tweet[];
}

export interface CreateTweetData {
  content: string;
}

export interface UpdateTweetData {
  content: string;
}

export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  createdAt: string;
  user: User;
}

export interface TweetInteraction {
  tweetId: string;
  action: 'like' | 'unlike';
  timestamp: string;
}

export interface TweetStats {
  likesCount: number;
  repliesCount: number;
}

export interface TweetThread {
  mainTweet: Tweet;
  replies: Tweet[];
  totalReplies: number;
}

export interface TweetSearchResult {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    username: string;
    imgUrl?: string;
  };
  createdAt: string;
  _count: {
    likes: number;
    replies: number;
  };
}

export interface TweetDraft {
  content: string;
  parentTweetId?: string;
  createdAt: string;
}
