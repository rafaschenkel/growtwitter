import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { THEME_COLORS } from '@/constants/theme';

export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const colors = THEME_COLORS[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
      },
      divider: colors.border,
      error: {
        main: colors.error,
      },
      success: {
        main: colors.success,
      },
      warning: {
        main: colors.warning,
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      body1: {
        fontSize: '15px',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '13px',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '24px',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '15px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& input:-webkit-autofill': {
                WebkitBoxShadow: mode === 'dark' 
                  ? `0 0 0 100px ${colors.surface} inset !important`
                  : `0 0 0 100px ${colors.background} inset !important`,
                WebkitTextFillColor: `${colors.text} !important`,
                caretColor: colors.text,
                borderRadius: '8px',
              },
              '& input:-webkit-autofill:hover': {
                WebkitBoxShadow: mode === 'dark'
                  ? `0 0 0 100px ${colors.surface} inset !important`
                  : `0 0 0 100px ${colors.background} inset !important`,
              },
              '& input:-webkit-autofill:focus': {
                WebkitBoxShadow: mode === 'dark'
                  ? `0 0 0 100px ${colors.surface} inset !important`
                  : `0 0 0 100px ${colors.background} inset !important`,
              },
              '& input:-webkit-autofill:active': {
                WebkitBoxShadow: mode === 'dark'
                  ? `0 0 0 100px ${colors.surface} inset !important`
                  : `0 0 0 100px ${colors.background} inset !important`,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};
