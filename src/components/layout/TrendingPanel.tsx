import { Box, Typography, Card, CardContent } from '@mui/material';

const TRENDING_TOPICS = [
  { title: '#ReactJS', tweets: '12.5K', category:'Development - Assunto do momento' },
  { title: '#TypeScript', tweets: '8.3K', category:'Development - Assunto do momento' },
  { title: '#Growdev', tweets: '5.2K', category:'Development - Assunto do momento' },
  { title: '#JavaScript', tweets: '15.7K', category:'Development - Assunto do momento' },
  { title: '#WebDevelopment', tweets: '9.1K', category:'Development - Assunto do momento' },
];

export const TrendingPanel = () => {
  return (
    <Box sx={{ p: 2, position: 'sticky', top: 0 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            O que está acontecendo
          </Typography>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {TRENDING_TOPICS.map((topic, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                borderBottom: index < TRENDING_TOPICS.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {topic.category}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {topic.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {topic.tweets} Tweets
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};
