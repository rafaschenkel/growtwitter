import type { Draft } from '@reduxjs/toolkit';
import type { Tweet, User } from '@/types';

export const updateTweetLike = (tweet: Draft<Tweet>, isLiked: boolean) => {
  tweet.isLiked = isLiked;
  tweet._count.likes += isLiked ? 1 : -1;
};

export const updateUserFollowCount = (user: Draft<User>, isFollowing: boolean) => {
  user._count.followers += isFollowing ? 1 : -1;
};

export const revertItemUpdate = <T extends { id: string }>(
  items: Draft<T[]>,
  id: string,
  originalItem: T
) => {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = originalItem as Draft<T>;
  }
};