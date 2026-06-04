import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme, setTheme } from '@/store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const changeTheme = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggle,
    setTheme: changeTheme,
  };
};
