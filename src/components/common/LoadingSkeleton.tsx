import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const TweetCardSkeleton = () => {
  return (
    <Card sx={{ mb: 0, borderRadius: 0, borderBottom: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
            <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={60} height={20} />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ProfileHeaderSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="circular" width={80} height={80} sx={{ mt: -5, mb: 2 }} />
        <Skeleton variant="text" width={200} height={32} />
        <Skeleton variant="text" width={150} height={20} />
        <Skeleton variant="text" width={300} height={20} sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>
      </Box>
    </Box>
  );
};
