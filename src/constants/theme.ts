export const THEME_COLORS = {
  light: {
    primary: '#1d9bf0',
    secondary: '#536471',
    background: '#ffffff',
    surface: '#f7f9fa',
    text: '#0f1419',
    textSecondary: '#536471',
    border: '#eff3f4',
    hover: '#f7f9fa',
    error: '#f4212e',
    success: '#00ba7c',
    warning: '#ffad1f',
  },
  dark: {
    primary: '#1d9bf0',
    secondary: '#71767b',
    background: '#000000',
    surface: '#16181c',
    text: '#e7e9ea',
    textSecondary: '#71767b',
    border: '#2f3336',
    hover: '#1c1f23',
    error: '#f4212e',
    success: '#00ba7c',
    warning: '#ffad1f',
  },
} as const;

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  modal: 1100,
  tooltip: 1200,
  notification: 1300,
} as const;