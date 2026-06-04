import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import { ROUTES } from '@/constants/routes';
import { Box, CircularProgress } from '@mui/material';

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { token, user, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading || (token && !user)) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (token && user) {
    const from = (location.state)?.from?.pathname || ROUTES.HOME;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
