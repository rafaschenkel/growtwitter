import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Alert, Snackbar } from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';
import { TweetCard, TweetModal, TweetDetailModal, TweetWithReplies } from '@/components/tweet';
import { TweetCardSkeleton } from '@/components/common';
import { useGetFeedQuery, useGetUserByIdQuery, useCreateTweetMutation, useCreateReplyMutation, useLikeTweetMutation, useUnlikeTweetMutation } from '@/store/api/apiSlice';
import { useAppSelector } from '@/store/hooks';
import { useSyncLoggedUser } from '@/hooks/useSyncLoggedUser';
import type { Tweet } from '@/types';

export const FeedPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, error } = useGetFeedQuery(undefined);
  
  const { data: fullUserData } = useGetUserByIdQuery(user?.id || '', {
    skip: !user?.id,
  });
  
  const fullUser = fullUserData && typeof fullUserData === 'object' && 'user' in fullUserData 
    ? fullUserData.user 
    : fullUserData;
  
  const [createTweet] = useCreateTweetMutation();
  const [createReply] = useCreateReplyMutation();
  const [likeTweet] = useLikeTweetMutation();
  const [unlikeTweet] = useUnlikeTweetMutation();

  useSyncLoggedUser();

  const [tabValue, setTabValue] = useState(0);
  const [tweetModalOpen, setTweetModalOpen] = useState(false);
  const [tweetDetailModalOpen, setTweetDetailModalOpen] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<Tweet | null>(null);
  const [replyToTweet, setReplyToTweet] = useState<Tweet | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localLikeState, setLocalLikeState] = useState<Record<string, boolean>>({});

  const tweets = Array.isArray(data) ? data : (data?.tweets || []);
  const likedTweetIds = Array.isArray(data) ? [] : (data?.likedTweetIds || []);
  const likedTweetIdsSet = new Set(likedTweetIds);

  const filteredTweets = tabValue === 0
    ? tweets
    : tweets.filter((tweet: Tweet) => {
        interface FollowingItem {
          following?: {
            id: string;
          };
        }
        
        const currentUser = fullUser || user;
        
        return tweet.userId !== currentUser?.id && 
               currentUser?.following?.some((item: FollowingItem) => item.following?.id === tweet.userId);
      });

  const mainTweets = filteredTweets.filter((tweet: Tweet) => !tweet.parentTweetId);
  const orphanReplies = filteredTweets.filter((tweet: Tweet) => 
    tweet.parentTweetId && !mainTweets.some((t: Tweet) => t.id === tweet.parentTweetId)
  );

  const handleLike = async (tweetId: string) => {
    const tweet = tweets.find((t: Tweet) => t.id === tweetId);
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
        setLocalLikeState(prev => ({
          ...prev,
          [tweetId]: false
        }));
      } else {
        await likeTweet(tweetId).unwrap();
        setLocalLikeState(prev => ({
          ...prev,
          [tweetId]: true
        }));
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      
      if (error?.status === 400 && !isCurrentlyLiked) {
        console.log('Tweet already liked, trying to unlike...');
        setLocalLikeState(prev => ({
          ...prev,
          [tweetId]: true
        }));
        
        try {
          await unlikeTweet(tweetId).unwrap();
          setLocalLikeState(prev => ({
            ...prev,
            [tweetId]: false
          }));
        } catch (unlikeError) {
          console.error('Error unliking:', unlikeError);
          setErrorMessage('Erro ao descurtir tweet. Tente novamente.');
        }
      } else {
        setErrorMessage('Erro ao curtir tweet. Tente novamente.');
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
      } else {
        await createTweet({ content }).unwrap();
      }
    } catch (error: any) {
      console.error('Error creating tweet:', error);
      const errorMsg = error?.data?.message || 'Erro ao publicar tweet. Tente novamente.';
      setErrorMessage(errorMsg);
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

  return (
    <MainLayout onTweetClick={() => setTweetModalOpen(true)}>
      <Box>
        <Box sx={{ pt: 2, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <Typography 
          variant="h6" sx={{ pl: 2}}>Página inicial</Typography>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth">
            <Tab label="Para você" />
            <Tab label="Seguindo" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            Erro ao carregar tweets. Tente novamente.
          </Alert>
        )}

        {isLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <TweetCardSkeleton key={i} />
            ))}
          </>
        ) : mainTweets.length === 0 && orphanReplies.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              {tabValue === 0 ? 'Nenhum tweet disponível' : 'Você ainda não segue ninguém'}
            </Typography>
          </Box>
        ) : (
          <>
            {mainTweets.map((tweet: Tweet) => {
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
                <TweetWithReplies
                  key={tweet.id}
                  tweet={tweetWithLocalState}
                  onLike={handleLike}
                  onReply={handleReply}
                  onTweetClick={handleTweetClick}
                  currentUserId={user?.id}
                  showReplies={true}
                  filterUserReplies={tabValue === 1 ? user?.id : undefined}
                />
              );
            })}
            
            {orphanReplies.map((tweet: Tweet) => {
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
                  showParent={!!tweet.parentTweetId}
                  parentTweet={tweet.parentTweet}
                  currentUserId={user?.id}
                />
              );
            })}
          </>
        )}
      </Box>

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
        currentUserId={user?.id}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};
