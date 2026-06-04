import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Skeleton,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomAvatar } from '@/components/common';
import { TweetCard, TweetModal, TweetDetailModal } from '@/components/tweet';
import { FollowersModal, FollowingModal } from '@/components/user';
import {
  useGetUserByIdQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useLikeTweetMutation,
  useUnlikeTweetMutation,
  useCreateReplyMutation,
} from '@/store/api/apiSlice';
import { useAppSelector } from '@/store/hooks';
import { useSyncLoggedUser } from '@/hooks/useSyncLoggedUser';
import type { Tweet } from '@/types';

const formatJoinDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Data inválida';
  }
};

type TabValue = 'tweets' | 'replies';

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<TabValue>('tweets');
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [tweetModalOpen, setTweetModalOpen] = useState(false);
  const [tweetDetailModalOpen, setTweetDetailModalOpen] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [replyToTweet, setReplyToTweet] = useState<Tweet | undefined>();
  const [isHoveringFollowBtn, setIsHoveringFollowBtn] = useState(false);
  const [isProcessingFollow, setIsProcessingFollow] = useState(false);
  const [localLikeState, setLocalLikeState] = useState<Record<string, boolean>>(
    {}
  );

  useSyncLoggedUser();

  const loggedUser = useAppSelector((state) => state.auth.user);

  const { data: freshLoggedUser } = useGetUserByIdQuery(loggedUser?.id || '', {
    skip: !loggedUser?.id,
  });

  const { data: userData, isLoading } = useGetUserByIdQuery(userId || '', {
    skip: !userId,
  });

  const user =
    userData && typeof userData === 'object' && 'user' in userData
      ? userData.user
      : userData;
  const likedTweetIds =
    userData && typeof userData === 'object' && 'likedTweetIds' in userData
      ? userData.likedTweetIds
      : [];
  const likedTweetIdsSet = new Set(likedTweetIds);

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [likeTweet] = useLikeTweetMutation();
  const [unlikeTweet] = useUnlikeTweetMutation();
  const [createReply] = useCreateReplyMutation();

  const isOwnProfile = loggedUser?.id === userId;

  const isFollowingUser = (() => {
    const currentUser = freshLoggedUser || loggedUser;
    if (!currentUser || !userId) return false;

    interface FollowingItem {
      following?: {
        id: string;
      };
    }

    const result =
      currentUser.following?.some(
        (item: FollowingItem) => item.following?.id === userId
      ) ?? false;
    return result;
  })();

  useEffect(() => {
    if (isProcessingFollow) {
      const timer = setTimeout(() => {
        setIsProcessingFollow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isFollowingUser, isProcessingFollow]);

  const filteredTweets = (() => {
    if (!user?.tweets) return [];

    const tweetsWithUser = user.tweets.map((tweet: Tweet) => ({
      ...tweet,
      user: user,
    }));

    if (activeTab === 'tweets') {
      return tweetsWithUser.filter(
        (tweet: Tweet) => tweet.parentTweetId === null
      );
    }

    if (activeTab === 'replies') {
      return tweetsWithUser.filter(
        (tweet: Tweet) => tweet.parentTweetId !== null
      );
    }

    return [];
  })();

  const groupedTweets =
    activeTab === 'replies'
      ? filteredTweets.reduce((acc: any[], tweet: Tweet) => {
          const existingGroup = acc.find(
            (group) =>
              group.parent?.id === tweet.parentTweetId ||
              group.children.some(
                (child: Tweet) => child.parentTweetId === tweet.parentTweetId
              )
          );

          if (existingGroup) {
            if (!existingGroup.parent && tweet.parentTweet) {
              existingGroup.parent = tweet.parentTweet;
            }
            existingGroup.children.push(tweet);
          } else {
            acc.push({
              parent: tweet.parentTweet || null,
              children: [tweet],
            });
          }
          return acc;
        }, [])
      : filteredTweets.map((tweet: Tweet) => ({
          parent: null,
          children: [tweet],
        }));

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: TabValue
  ) => {
    setActiveTab(newValue);
  };

  const handleLike = async (tweetId: string) => {
    if (!user?.tweets) return;

    const tweet = user.tweets.find((t: Tweet) => t.id === tweetId);
    if (!tweet) return;

    let isCurrentlyLiked: boolean;
    if (tweetId in localLikeState) {
      isCurrentlyLiked = localLikeState[tweetId];
    } else if (likedTweetIds.length > 0) {
      isCurrentlyLiked = likedTweetIdsSet.has(tweetId);
    } else {
      isCurrentlyLiked = tweet.isLiked ?? false;
    }

    try {
      if (isCurrentlyLiked) {
        await unlikeTweet(tweetId).unwrap();
        setLocalLikeState((prev) => ({
          ...prev,
          [tweetId]: false,
        }));
      } else {
        await likeTweet(tweetId).unwrap();
        setLocalLikeState((prev) => ({
          ...prev,
          [tweetId]: true,
        }));
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);

      if (error?.status === 400 && !isCurrentlyLiked) {
        console.log('Tweet already liked, trying to unlike...');
        setLocalLikeState((prev) => ({
          ...prev,
          [tweetId]: true,
        }));

        try {
          await unlikeTweet(tweetId).unwrap();
          setLocalLikeState((prev) => ({
            ...prev,
            [tweetId]: false,
          }));
        } catch (unlikeError) {
          console.error('Error unliking:', unlikeError);
        }
      }
    }
  };

  const handleReply = (tweet: Tweet) => {
    setReplyToTweet(tweet);
    setTweetModalOpen(true);
    setTweetDetailModalOpen(false);
  };

  const handleTweetClick = (tweet: Tweet) => {
    setSelectedTweet(tweet);
    setTweetDetailModalOpen(true);
  };

  const handleSubmitTweet = async (content: string, parentTweetId?: string) => {
    try {
      if (parentTweetId) {
        await createReply({ tweetId: parentTweetId, content }).unwrap();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
      throw error;
    }
  };

  const handleCloseTweetModal = () => {
    setTweetModalOpen(false);
    setReplyToTweet(undefined);
  };

  const handleCloseTweetDetailModal = () => {
    setTweetDetailModalOpen(false);
    setSelectedTweet(null);
  };

  const handleFollowToggle = async () => {
    if (!userId) return;

    setIsProcessingFollow(true);

    try {
      if (isFollowingUser) {
        await unfollowUser(userId).unwrap();
      } else {
        await followUser(userId).unwrap();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setIsProcessingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout onTweetClick={() => setTweetModalOpen(true)}>
        <Box>
          <Box sx={{ bgcolor: 'primary.main', height: 200 }} />
          <Box sx={{ p: 2 }}>
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mt: -5, mb: 2 }}
            />
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={180} height={20} sx={{ mt: 1 }} />
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>
        </Box>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout onTweetClick={() => setTweetModalOpen(true)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            Erro ao carregar perfil
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Não foi possível carregar as informações do usuário.
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout onTweetClick={() => setTweetModalOpen(true)}>
      <Box>
        <Box
          sx={{
            bgcolor: 'primary.main',
            height: 200,
            position: 'relative',
          }}
        />

        <Box sx={{ p: 2, position: 'relative' }}>
          <CustomAvatar
            name={user.name}
            imgUrl={user.imgUrl}
            sx={{
              width: 80,
              height: 80,
              border: '4px solid',
              borderColor: 'background.paper',
              mt: -5,
              mb: 2,
            }}
          />

          {!isOwnProfile && (
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Button
                variant={isFollowingUser ? 'outlined' : 'contained'}
                onClick={handleFollowToggle}
                disabled={isProcessingFollow}
                onMouseEnter={() => setIsHoveringFollowBtn(true)}
                onMouseLeave={() => setIsHoveringFollowBtn(false)}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 700,
                  minWidth: '140px',
                  ...(isFollowingUser && {
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: 'error.main',
                      color: 'error.main',
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    },
                  }),
                }}
              >
                {isProcessingFollow ? (
                  <CircularProgress size={20} />
                ) : isFollowingUser ? (
                  isHoveringFollowBtn ? (
                    'Deixar de seguir'
                  ) : (
                    'Seguindo'
                  )
                ) : (
                  'Seguir'
                )}
              </Button>
            </Box>
          )}

          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            @{user.username}
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Ingressou em {formatJoinDate(user.createdAt)}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setFollowingModalOpen(true)}
              sx={{
                p: 0,
                minWidth: 'auto',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {user._count.following}
              </Typography>
              <Typography
                component="span"
                color="textSecondary"
                sx={{ ml: 0.5 }}
              >
                seguindo
              </Typography>
            </Button>

            <Button
              variant="text"
              onClick={() => setFollowersModalOpen(true)}
              sx={{
                p: 0,
                minWidth: 'auto',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {user._count.followers}
              </Typography>
              <Typography
                component="span"
                color="textSecondary"
                sx={{ ml: 0.5 }}
              >
                {user._count.followers === 1 ? 'seguidor' : 'seguidores'}
              </Typography>
            </Button>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '15px',
                minWidth: 0,
                flex: 1,
              },
            }}
          >
            <Tab label="Tweets" value="tweets" />
            <Tab label="Respostas" value="replies" />
          </Tabs>
        </Box>

        <Box>
          {groupedTweets.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                {activeTab === 'replies'
                  ? 'Nenhuma resposta disponível'
                  : 'Nenhum tweet disponível'}
              </Typography>
            </Box>
          ) : (
            <Box>
              {groupedTweets.map((group: any, groupIndex: number) => {
                if (group.parent && activeTab === 'replies') {
                  return (
                    <Box key={`group-${groupIndex}`}>
                      {group.children.map(
                        (tweet: Tweet, childIndex: number) => {
                          let isLiked: boolean;
                          if (tweet.id in localLikeState) {
                            isLiked = localLikeState[tweet.id];
                          } else if (likedTweetIds.length > 0) {
                            isLiked = likedTweetIdsSet.has(tweet.id);
                          } else {
                            isLiked = tweet.isLiked ?? false;
                          }

                          const tweetWithLocalState = {
                            ...tweet,
                            isLiked,
                          };

                          return (
                            <TweetCard
                              key={tweet.id}
                              tweet={tweetWithLocalState}
                              onLike={handleLike}
                              onReply={handleReply}
                              onTweetClick={handleTweetClick}
                              showParent={childIndex === 0}
                              parentTweet={group.parent}
                              currentUserId={loggedUser?.id}
                            />
                          );
                        }
                      )}
                    </Box>
                  );
                }

                const tweet = group.children[0];

                let isLiked: boolean;
                if (tweet.id in localLikeState) {
                  isLiked = localLikeState[tweet.id];
                } else if (likedTweetIds.length > 0) {
                  isLiked = likedTweetIdsSet.has(tweet.id);
                } else {
                  isLiked = tweet.isLiked ?? false;
                }

                const tweetWithLocalState = {
                  ...tweet,
                  isLiked,
                };

                return (
                  <TweetCard
                    key={tweet.id}
                    tweet={tweetWithLocalState}
                    onLike={handleLike}
                    onReply={handleReply}
                    onTweetClick={handleTweetClick}
                    showParent={false}
                    currentUserId={loggedUser?.id}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        <FollowersModal
          open={followersModalOpen}
          onClose={() => setFollowersModalOpen(false)}
          followers={user?.followers || []}
          isLoading={isLoading}
        />

        <FollowingModal
          open={followingModalOpen}
          onClose={() => setFollowingModalOpen(false)}
          following={user?.following || []}
          isLoading={isLoading}
        />

        <TweetModal
          open={tweetModalOpen}
          onClose={handleCloseTweetModal}
          onSubmit={handleSubmitTweet}
          replyTo={replyToTweet}
        />

        <TweetDetailModal
          open={tweetDetailModalOpen}
          onClose={handleCloseTweetDetailModal}
          tweet={selectedTweet}
          onLike={handleLike}
          onReply={handleReply}
          onTweetClick={handleTweetClick}
          currentUserId={loggedUser?.id}
        />
      </Box>
    </MainLayout>
  );
};
