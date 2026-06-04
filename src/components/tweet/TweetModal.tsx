import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Tweet } from '@/types';
import { CustomAvatar } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { TWEET_MAX_LENGTH } from '@/constants';

interface TweetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, parentTweetId?: string) => Promise<void>;
  replyTo?: Tweet;
}

export const TweetModal = ({ open, onClose, onSubmit, replyTo }: TweetModalProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(content, replyTo?.id);
      setContent('');
      onClose();
    } catch (error: any) {
      console.error('Error submitting tweet:', error);
      const errorMsg = error?.data?.message || 'Erro ao publicar. Tente novamente.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={handleClose} disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {replyTo && (
          <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CustomAvatar name={replyTo.user.name} imgUrl={replyTo.user.imgUrl} />
              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600 }}>{replyTo.user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    @{replyTo.user.username}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {replyTo.content}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, ml: 7 }}>
              Respondendo a @{replyTo.user.username}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          {user && <CustomAvatar name={user.name} imgUrl={user.imgUrl} />}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={replyTo ? 'Escreva sua resposta' : 'O que está acontecendo?'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            slotProps={{
              htmlInput: { maxLength: TWEET_MAX_LENGTH },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <Typography
            variant="caption"
            color={content.length > TWEET_MAX_LENGTH * 0.9 ? 'error' : 'textSecondary'}
          >
            {content.length}/{TWEET_MAX_LENGTH}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          sx={{ borderRadius: '24px', px: 3 }}
        >
          {isSubmitting ? <CircularProgress size={20} /> : replyTo ? 'Responder' : 'Tweetar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
