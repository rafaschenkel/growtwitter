import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TrendingPanel } from './TrendingPanel';

interface MainLayoutProps {
  children: ReactNode;
  onTweetClick: () => void;
}

export const MainLayout = ({ children, onTweetClick }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', width: '100%', maxWidth: 1400 }}>
        <Sidebar onTweetClick={onTweetClick} />
        <Box
          component="main"
          sx={{
            flex: 2,
            maxWidth: 800,
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          {children}
        </Box>
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          <TrendingPanel />
        </Box>
      </Box>
    </Box>
  );
};
