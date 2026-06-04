import { Card, CardContent, Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { useNavigate } from 'react-router-dom';
import type { Tweet } from '@/types';
import { CustomAvatar, RelativeTimestamp } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useGetTweetByIdQuery } from '@/store/api/apiSlice';

interface TweetCardProps {
  tweet: Tweet;
  onLike: (tweetId: string) => void;
  onReply: (tweet: Tweet) => void;
  onTweetClick?: (tweet: Tweet) => void;
  showParent?: boolean;
  currentUserId?: string;
  parentTweet?: Tweet;
}

interface SingleTweetProps {
  tweet: Tweet;
  onLike?: (tweetId: string) => void;
  onReply?: (tweet: Tweet) => void;
  onUserClick: (e: React.MouseEvent, userId: string) => void;
  isOwnTweet: boolean;
  isParent?: boolean;
  showActions?: boolean;
}

const SingleTweet = ({ 
  tweet, 
  onLike, 
  onReply, 
  onUserClick, 
  isOwnTweet,
  isParent = false,
  showActions = true,
}: SingleTweetProps) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          mb: 0.5,
        }}
      >
        <Typography
          variant={isParent ? 'body2' : 'body1'}
          onClick={(e) => onUserClick(e, tweet.user.id)}
          sx={{
            cursor: 'pointer',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {tweet.user.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          @{tweet.user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          · <RelativeTimestamp date={tweet.createdAt} />
        </Typography>
      </Box>

      <Typography 
        variant={isParent ? 'body2' : 'body1'}
        sx={{ 
          mb: showActions ? 1 : 0,
          whiteSpace: 'pre-wrap',
          ...(isParent && {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }),
        }}
      >
        {tweet.content}
      </Typography>

      {showActions && (
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onReply?.(tweet);
              }}
            >
              <ModeCommentOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {tweet._count.replies}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (!isOwnTweet) {
                  onLike?.(tweet.id);
                }
              }}
              disabled={isOwnTweet}
              sx={{
                color: tweet.isLiked ? 'error.main' : 'text.secondary',
                '&:hover': {
                  color: isOwnTweet ? 'text.secondary' : 'error.main',
                  bgcolor: isOwnTweet ? 'transparent' : 'rgba(244, 67, 54, 0.08)',
                },
                '&.Mui-disabled': {
                  color: 'text.secondary',
                  opacity: 0.5,
                },
              }}
            >
              {tweet.isLiked ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <Typography
              variant="body2"
              sx={{
                color: tweet.isLiked ? 'error.main' : 'text.secondary',
              }}
            >
              {tweet._count.likes}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export const TweetCard = ({
  tweet,
  onLike,
  onReply,
  onTweetClick,
  showParent = false,
  currentUserId,
  parentTweet,
}: TweetCardProps) => {
  const navigate = useNavigate();

  const { data: parentTweetData } = useGetTweetByIdQuery(tweet.parentTweetId || '', {
    skip: !showParent || !tweet.parentTweetId || !!parentTweet,
  });

  const fetchedParentTweet = parentTweetData && typeof parentTweetData === 'object' && 'tweet' in parentTweetData 
    ? parentTweetData.tweet 
    : parentTweetData;

  const actualParentTweet = parentTweet || fetchedParentTweet;

  if (!tweet.user) {
    console.error('TweetCard: tweet.user is undefined', tweet);
    return null;
  }

  const isOwnTweet = currentUserId === tweet.userId;
  const hasParentToShow = showParent && actualParentTweet && actualParentTweet.user;

  const handleUserClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    navigate(ROUTES.PROFILE(userId));
  };

  const handleCardClick = () => {
    if (onTweetClick) {
      onTweetClick(tweet);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        mb: 0,
        borderRadius: 0,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {hasParentToShow && actualParentTweet && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100px' }}>
              <Box
                onClick={(e) => handleUserClick(e, actualParentTweet.user.id)}
                sx={{ cursor: 'pointer' }}
              >
                <CustomAvatar 
                  name={actualParentTweet.user.name} 
                  imgUrl={actualParentTweet.user.imgUrl}
                  sx={{ width: 40, height: 40 }}
                />
              </Box>
              <Box
                sx={{
                  width: '2px',
                  bgcolor: 'divider',
                  flex: 1,
                  my: 0.5,
                  minHeight: '40px',
                }}
              />
            </Box>

            <Box sx={{ flex: 1, opacity: 0.7 }}>
              <SingleTweet
                tweet={actualParentTweet}
                onUserClick={handleUserClick}
                isOwnTweet={false}
                isParent={true}
                showActions={false}
              />
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            onClick={(e) => handleUserClick(e, tweet.user.id)}
            sx={{ cursor: 'pointer' }}
          >
            <CustomAvatar name={tweet.user.name} imgUrl={tweet.user.imgUrl} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <SingleTweet
              tweet={tweet}
              onLike={onLike}
              onReply={onReply}
              onUserClick={handleUserClick}
              isOwnTweet={isOwnTweet}
              isParent={false}
              showActions={true}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
