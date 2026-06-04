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
import { 
  useFollowUserMutation, 
  useUnfollowUserMutation,
  useGetUserByIdQuery 
} from '@/store/api/apiSlice';
import { useAppSelector } from '@/store/hooks';
import { useSyncLoggedUser } from '@/hooks/useSyncLoggedUser';
import type { User } from '@/types';

interface FollowingModalProps {
  open: boolean;
  onClose: () => void;
  following: User[];
  isLoading?: boolean;
}

export const FollowingModal = ({ open, onClose, following, isLoading }: FollowingModalProps) => {
  const navigate = useNavigate();
  const loggedUser = useAppSelector((state) => state.auth.user);
  
  const { data: freshLoggedUser } = useGetUserByIdQuery(loggedUser?.id || '', {
    skip: !loggedUser?.id,
  });
  
  const [followUser] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] = useUnfollowUserMutation();
  const [error, setError] = useState<string | null>(null);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [hoveringUserId, setHoveringUserId] = useState<string | null>(null);

  useSyncLoggedUser();

  const isFollowingUser = (userId: string): boolean => {
    const freshUser = freshLoggedUser && typeof freshLoggedUser === 'object' && 'user' in freshLoggedUser
      ? freshLoggedUser.user
      : freshLoggedUser;
    
    const currentUser = freshUser || loggedUser;
    if (!currentUser) return false;
    
    return currentUser.following?.some((item: any) => item?.following?.id === userId || item?.id === userId) ?? false;
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
      // Pequena pausa para o cache invalidar
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      const errorMsg = error?.data?.message || 'Erro ao processar ação. Tente novamente.';
      setError(errorMsg);
    } finally {
      setProcessingUserId(null);
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
          Seguindo
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
        ) : following.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Não está seguindo ninguém ainda
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {following.map((item: any) => {
              const followedUser = item.following || item;
              const isOwnProfile = loggedUser?.id === followedUser.id;
              const isFollowing = isFollowingUser(followedUser.id);
              const isProcessing = processingUserId === followedUser.id;

              return (
                <ListItem
                  key={followedUser.id}
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
                        onClick={() => handleFollowToggle(followedUser.id)}
                        onMouseEnter={() => setHoveringUserId(followedUser.id)}
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
                          hoveringUserId === followedUser.id ? 'Deixar de seguir' : 'Seguindo'
                        ) : (
                          'Seguir'
                        )}
                      </Button>
                    )
                  }
                >
                  <ListItemAvatar>
                    <Box
                      onClick={() => handleUserClick(followedUser.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <CustomAvatar
                        name={followedUser.name}
                        imgUrl={followedUser.imgUrl}
                        sx={{ width: 48, height: 48 }}
                      />
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        onClick={() => handleUserClick(followedUser.id)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {followedUser.name}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        onClick={() => handleUserClick(followedUser.id)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        @{followedUser.username}
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
