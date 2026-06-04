import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CustomAvatar } from '@/components/common';
import { useFollowUserMutation, useUnfollowUserMutation } from '@/store/api/apiSlice';
import { useAppSelector } from '@/store/hooks';
import { useSyncLoggedUser } from '@/hooks/useSyncLoggedUser';
import type { User } from '@/types';

interface FollowersModalProps {
  open: boolean;
  onClose: () => void;
  followers: User[];
  isLoading?: boolean;
}

export const FollowersModal = ({ open, onClose, followers, isLoading }: FollowersModalProps) => {
  const navigate = useNavigate();
  const loggedUser = useAppSelector((state) => state.auth.user);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();
  const [error, setError] = useState<string | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [hoveringUserId, setHoveringUserId] = useState<string | null>(null);

  useSyncLoggedUser();

  const isFollowingUser = (userId: string): boolean => {
    if (!loggedUser) return false;
    return loggedUser.following?.some((item) => item.following?.id === userId) ?? false;
  };

  const handleFollowToggle = async (userId: string) => {
    if (!loggedUser || userId === loggedUser.id) return;

    setProcessingUserId(userId);
    setError(null);

    try {
      if (isFollowingUser(userId)) {
        await unfollowUser(userId).unwrap();
      } else {
        await followUser(userId).unwrap();
      }
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      const errorMsg = error?.data?.message || 'Erro ao processar ação. Tente novamente.';
      setError(errorMsg);
    } finally {
      setTimeout(() => {
        setProcessingUserId(null);
      }, 500);
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ fontWeight: 700 }}>
          Seguidores
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, px: 0 }}>
        {error && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : followers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Nenhum seguidor ainda
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {followers.map((item: any) => {
              const follower = item.follower || item;
              const isOwnProfile = loggedUser?.id === follower.id;
              const isFollowing = isFollowingUser(follower.id);
              const isProcessing = processingUserId === follower.id;

              return (
                <ListItem
                  key={follower.id}
                  sx={{
                    px: 2,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  secondaryAction={
                    !isOwnProfile && (
                      <Button
                        variant={isFollowing ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => handleFollowToggle(follower.id)}
                        onMouseEnter={() => setHoveringUserId(follower.id)}
                        onMouseLeave={() => setHoveringUserId(null)}
                        disabled={isProcessing || isUnfollowing}
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          fontWeight: 700,
                          minWidth: '140px',
                          ...(isFollowing && {
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
                        {isProcessing ? (
                          <CircularProgress size={16} />
                        ) : isFollowing ? (
                          hoveringUserId === follower.id ? 'Deixar de seguir' : 'Seguindo'
                        ) : (
                          'Seguir'
                        )}
                      </Button>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Box
                      onClick={() => handleUserClick(follower.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CustomAvatar
                        name={follower.name}
                        imgUrl={follower.imgUrl}
                        sx={{ width: 48, height: 48 }}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        onClick={() => handleUserClick(follower.id)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {follower.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        onClick={() => handleUserClick(follower.id)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        @{follower.username}
                      </Typography>
                    }
                    sx={{ mr: 2 }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
