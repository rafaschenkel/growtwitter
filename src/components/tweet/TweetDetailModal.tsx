import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { useNavigate } from 'react-router-dom';
import type { Tweet } from '@/types';
import { CustomAvatar, RelativeTimestamp } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useGetTweetByIdQuery } from '@/store/api/apiSlice';

interface TweetDetailModalProps {
  open: boolean;
  onClose: () => void;
  tweet: Tweet | null;
  onLike: (tweetId: string) => void;
  onReply: (tweet: Tweet) => void;
  onTweetClick?: (tweet: Tweet) => void;
  currentUserId?: string;
}

export const TweetDetailModal = ({
  open,
  onClose,
  tweet,
  onLike,
  onReply,
  onTweetClick,
  currentUserId,
}: TweetDetailModalProps) => {
  const navigate = useNavigate();
  
  const { data, isLoading, isFetching } = useGetTweetByIdQuery(tweet?.id || '', {
    skip: !tweet?.id || !open,
    refetchOnMountOrArgChange: true, 
  });

  const fullTweet = data && typeof data === 'object' && 'tweet' in data ? data.tweet : data;
  const likedTweetIds = data && typeof data === 'object' && 'likedTweetIds' in data ? data.likedTweetIds : [];
  const likedTweetIdsSet = new Set(likedTweetIds);

  if (!tweet || !open) return null;

  const isLoadingNewData = isFetching || (open && !fullTweet);

  const displayTweet = fullTweet || tweet;
  const replies = fullTweet?.replies || [];
  const isOwnTweet = currentUserId === displayTweet.userId;

  const mainTweetIsLiked = likedTweetIds.length > 0 
    ? likedTweetIdsSet.has(displayTweet.id)
    : (displayTweet.isLiked ?? false);

  const displayTweetWithLikeStatus = {
    ...displayTweet,
    isLiked: mainTweetIsLiked,
  };

  const handleUserClick = (userId: string) => {
    navigate(ROUTES.PROFILE(userId));
    onClose();
  };

  return (
    <Dialog
      key={tweet.id}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            maxHeight: '90vh',
          },
        },
      }}
    >
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 1 }}>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0, px: 0 }}>
        {isLoadingNewData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box
              onClick={() => handleUserClick(displayTweetWithLikeStatus.user.id)}
              sx={{ cursor: 'pointer' }}
            >
              <CustomAvatar name={displayTweetWithLikeStatus.user.name} imgUrl={displayTweetWithLikeStatus.user.imgUrl} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                onClick={() => handleUserClick(displayTweetWithLikeStatus.user.id)}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {displayTweetWithLikeStatus.user.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                @{displayTweetWithLikeStatus.user.username}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {displayTweetWithLikeStatus.content}
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            <RelativeTimestamp date={displayTweetWithLikeStatus.createdAt} />
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onReply(displayTweetWithLikeStatus)}
              >
                <ModeCommentOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                {displayTweetWithLikeStatus._count.replies}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => {
                  if (!isOwnTweet) {
                    onLike(displayTweetWithLikeStatus.id);
                  }
                }}
                disabled={isOwnTweet}
                sx={{
                  color: displayTweetWithLikeStatus.isLiked ? 'error.main' : 'text.secondary',
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
                {displayTweetWithLikeStatus.isLiked ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  color: displayTweetWithLikeStatus.isLiked ? 'error.main' : 'text.secondary',
                }}
              >
                {displayTweetWithLikeStatus._count.likes}
              </Typography>
            </Box>
          </Box>

          <Divider />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : replies.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Nenhuma resposta ainda
            </Typography>
          </Box>
        ) : (
          <Box>
            {replies.map((reply: Tweet) => {
              const isOwnReply = currentUserId === reply.userId;
              
              const replyIsLiked = likedTweetIds.length > 0
                ? likedTweetIdsSet.has(reply.id)
                : (reply.isLiked ?? false);
              
              const replyWithLikeStatus = {
                ...reply,
                isLiked: replyIsLiked,
              };
              
              return (
              <Box
                key={reply.id}
                sx={{
                  px: 2,
                  py: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(replyWithLikeStatus.user.id);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <CustomAvatar name={replyWithLikeStatus.user.name} imgUrl={replyWithLikeStatus.user.imgUrl} />
                  </Box>

                  <Box 
                    sx={{ 
                      flex: 1,
                      cursor: onTweetClick ? 'pointer' : 'default',
                    }}
                    onClick={(e) => {
                      if (onTweetClick) {
                        e.stopPropagation();
                        onTweetClick(replyWithLikeStatus);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(replyWithLikeStatus.user.id);
                          }}
                          sx={{
                            cursor: 'pointer',
                            fontWeight: 600,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {replyWithLikeStatus.user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          @{replyWithLikeStatus.user.username}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        <RelativeTimestamp date={replyWithLikeStatus.createdAt} />
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                      {replyWithLikeStatus.content}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onReply(replyWithLikeStatus);
                          }}
                        >
                          <ModeCommentOutlinedIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" color="textSecondary">
                          {replyWithLikeStatus._count.replies}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwnReply) {
                              onLike(replyWithLikeStatus.id);
                            }
                          }}
                          disabled={isOwnReply}
                          sx={{
                            color: replyWithLikeStatus.isLiked ? 'error.main' : 'text.secondary',
                            '&:hover': {
                              color: isOwnReply ? 'text.secondary' : 'error.main',
                              bgcolor: isOwnReply ? 'transparent' : 'rgba(244, 67, 54, 0.08)',
                            },
                            '&.Mui-disabled': {
                              color: 'text.secondary',
                              opacity: 0.5,
                            },
                          }}
                        >
                          {replyWithLikeStatus.isLiked ? (
                            <FavoriteIcon fontSize="small" />
                          ) : (
                            <FavoriteBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                        <Typography
                          variant="body2"
                          sx={{
                            color: replyWithLikeStatus.isLiked ? 'error.main' : 'text.secondary',
                          }}
                        >
                          {replyWithLikeStatus._count.likes}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              );
            })}
          </Box>
        )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
