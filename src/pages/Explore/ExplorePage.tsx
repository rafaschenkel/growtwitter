import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { MainLayout } from '@/components/layout/MainLayout';

const TRENDING_TOPICS = [
  {
    id: '1',
    title: '#ReactJS',
    category: 'Tecnologia',
    tweetCount: '12.5K',
  },
  {
    id: '2',
    title: '#TypeScript',
    category: 'Programação',
    tweetCount: '8.3K',
  },
  {
    id: '3',
    title: '#Growdev',
    category: 'Educação',
    tweetCount: '5.2K',
  },
  {
    id: '4',
    title: '#JavaScript',
    category: 'Tecnologia',
    tweetCount: '15.7K',
  },
  {
    id: '5',
    title: '#WebDevelopment',
    category: 'Desenvolvimento',
    tweetCount: '9.1K',
  },
  {
    id: '6',
    title: '#Frontend',
    category: 'Tecnologia',
    tweetCount: '7.4K',
  },
  {
    id: '7',
    title: '#Redux',
    category: 'Programação',
    tweetCount: '4.8K',
  },
  {
    id: '8',
    title: '#MaterialUI',
    category: 'Design',
    tweetCount: '3.6K',
  },
  {
    id: '9',
    title: '#Vite',
    category: 'Ferramentas',
    tweetCount: '6.2K',
  },
  {
    id: '10',
    title: '#NodeJS',
    category: 'Backend',
    tweetCount: '11.9K',
  },
];

export const ExplorePage = () => {
  return (
    <MainLayout onTweetClick={() => {}}>
      <Box>
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
          }}
        >
          <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
            Explorar
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Trending Topics
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {TRENDING_TOPICS.map((topic) => (
              <Card
                key={topic.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={topic.category}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          mb: 0.5,
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          mt: 0.5,
                          mb: 0.5,
                        }}
                      >
                        {topic.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {topic.tweetCount} Tweets
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};
