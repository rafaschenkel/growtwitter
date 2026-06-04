export interface BaseUser {
  id: string;
  name: string;
  username: string;
  email: string;
  imgUrl?: string;
  createdAt: string;
  _count: {
    followers: number;
    following: number;
    tweets: number;
  };
}

export interface BaseTweet {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  parentTweetId?: string;
  _count: {
    likes: number;
    replies: number;
  };
  isLiked?: boolean;
}