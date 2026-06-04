import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
}

export const ThemeToggle = ({ size = 'small', showTooltip = true }: ThemeToggleProps) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const button = (
    <IconButton 
      size={size} 
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      sx={{
        color: 'text.primary',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}>
        {button}
      </Tooltip>
    );
  }

  return button;
};
