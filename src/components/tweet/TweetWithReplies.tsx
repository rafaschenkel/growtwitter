import { CustomAvatar, RelativeTimestamp } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useGetTweetByIdQuery } from '@/store/api/apiSlice';
import type { Tweet } from '@/types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TweetWithRepliesProps {
  tweet: Tweet;
  onLike: (tweetId: string) => void;
  onReply: (tweet: Tweet) => void;
  onTweetClick?: (tweet: Tweet) => void;
  currentUserId?: string;
  showReplies?: boolean;
  filterUserReplies?: string;
}

export const TweetWithReplies = ({
  tweet,
  onLike,
  onReply,
  onTweetClick,
  currentUserId,
  showReplies = true,
  filterUserReplies,
}: TweetWithRepliesProps) => {
  const navigate = useNavigate();

  const shouldFetchReplies =
    showReplies && tweet._count.replies > 0 && !tweet.parentTweetId;

  const { data } = useGetTweetByIdQuery(tweet.id, {
    skip: !shouldFetchReplies,
  });

  const fullTweet =
    data && typeof data === 'object' && 'tweet' in data ? data.tweet : data;
  const allReplies = fullTweet?.replies || [];

  const replies = filterUserReplies
    ? allReplies.filter((reply: Tweet) => reply.userId !== filterUserReplies)
    : allReplies;

  const handleUserClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    navigate(ROUTES.PROFILE(userId));
  };

  const handleCardClick = (clickedTweet: Tweet) => {
    if (onTweetClick) {
      onTweetClick(clickedTweet);
    }
  };

  if (!shouldFetchReplies || replies.length === 0) {
    const isOwnTweet = currentUserId === tweet.userId;

    return (
      <Card
        onClick={() => handleCardClick(tweet)}
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              onClick={(e) => handleUserClick(e, tweet.user.id)}
              sx={{ cursor: 'pointer' }}
            >
              <CustomAvatar name={tweet.user.name} imgUrl={tweet.user.imgUrl} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1,
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="body1"
                  onClick={(e) => handleUserClick(e, tweet.user.id)}
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
                variant="body1"
                sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
              >
                {tweet.content}
              </Typography>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReply(tweet);
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
                        onLike(tweet.id);
                      }
                    }}
                    disabled={isOwnTweet}
                    sx={{
                      color: tweet.isLiked ? 'error.main' : 'text.secondary',
                      '&:hover': {
                        color: isOwnTweet ? 'text.secondary' : 'error.main',
                        bgcolor: isOwnTweet
                          ? 'transparent'
                          : 'rgba(244, 67, 54, 0.08)',
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        mb: 0,
        borderRadius: 0,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={(e) => handleUserClick(e, tweet.user.id)}
              sx={{ cursor: 'pointer' }}
            >
              <CustomAvatar name={tweet.user.name} imgUrl={tweet.user.imgUrl} />
            </Box>
            <Box
              sx={{
                width: '2px',
                flex: 1,
                bgcolor: 'divider',
                minHeight: '8px',
              }}
            />
          </Box>

          <Box
            onClick={() => handleCardClick(tweet)}
            sx={{
              flex: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
              p: 1,
              mx: -1,
              borderRadius: 1,
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="body1"
                onClick={(e) => handleUserClick(e, tweet.user.id)}
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

            <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              {tweet.content}
            </Typography>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReply(tweet);
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
                    if (currentUserId !== tweet.userId) {
                      onLike(tweet.id);
                    }
                  }}
                  disabled={currentUserId === tweet.userId}
                  sx={{
                    color: tweet.isLiked ? 'error.main' : 'text.secondary',
                    '&:hover': {
                      color:
                        currentUserId === tweet.userId
                          ? 'text.secondary'
                          : 'error.main',
                      bgcolor:
                        currentUserId === tweet.userId
                          ? 'transparent'
                          : 'rgba(244, 67, 54, 0.08)',
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
          </Box>
        </Box>

        {replies.map((reply: Tweet, index: number) => {
          const isOwnReply = currentUserId === reply.userId;

          return (
            <Box
              key={reply.id}
              sx={{ display: 'flex', gap: 2, position: 'relative' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: '2px',
                    height: '8px',
                    bgcolor: 'divider',
                  }}
                />
                <Box
                  onClick={(e) => handleUserClick(e, reply.user.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CustomAvatar
                    name={reply.user.name}
                    imgUrl={reply.user.imgUrl}
                  />
                </Box>
                {index < replies.length - 1 && (
                  <Box
                    sx={{
                      width: '2px',
                      flex: 1,
                      bgcolor: 'divider',
                      minHeight: '8px',
                    }}
                  />
                )}
              </Box>

              <Box
                onClick={() => handleCardClick(reply)}
                sx={{
                  flex: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  p: 1,
                  mx: -1,
                  borderRadius: 1,
                  pt: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    onClick={(e) => handleUserClick(e, reply.user.id)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {reply.user.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    @{reply.user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    · <RelativeTimestamp date={reply.createdAt} />
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{ mb: 1, whiteSpace: 'pre-wrap' }}
                >
                  {reply.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReply(reply);
                      }}
                    >
                      <ModeCommentOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary">
                      {reply._count.replies}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOwnReply) {
                          onLike(reply.id);
                        }
                      }}
                      disabled={isOwnReply}
                      sx={{
                        color: reply.isLiked ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          color: isOwnReply ? 'text.secondary' : 'error.main',
                          bgcolor: isOwnReply
                            ? 'transparent'
                            : 'rgba(244, 67, 54, 0.08)',
                        },
                        '&.Mui-disabled': {
                          color: 'text.secondary',
                          opacity: 0.5,
                        },
                      }}
                    >
                      {reply.isLiked ? (
                        <FavoriteIcon fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{
                        color: reply.isLiked ? 'error.main' : 'text.secondary',
                      }}
                    >
                      {reply._count.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
};
