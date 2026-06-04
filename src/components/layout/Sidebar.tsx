import LogoGrowtweet from '@/assets/logo.svg';
import { CustomAvatar, ThemeToggle } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { PermIdentity, Tag } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  onTweetClick: () => void;
}

export const Sidebar = ({ onTweetClick }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Página Inicial', icon: <HomeIcon />, path: ROUTES.HOME },
    { label: 'Explorar', icon: <Tag />, path: ROUTES.EXPLORE },
    { label: 'Perfil', icon: <PermIdentity />, path: user ? ROUTES.PROFILE(user.id) : '#' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box
      sx={{
        width: 275,
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            px: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img 
            src={LogoGrowtweet} 
            alt="Growtweet" 
            style={{ 
              height: '32px',
              width: 'auto',
            }} 
          />
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: '24px',
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isActive(item.path) ? 700 : 400,
                      fontSize: '1.25rem',
                    },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={onTweetClick}
        sx={{ mb: 2, py: 1.5, fontSize: '1rem' }}
      >
        Tweetar
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', flex:1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          {user && <CustomAvatar name={user.name} imgUrl={user.imgUrl} />}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>@{user?.username}</Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>

          <ThemeToggle />
          <IconButton size="small" onClick={logout} color="error">
            <LogoutIcon />
          </IconButton>
      </Box>
    </Box>
  );
};
