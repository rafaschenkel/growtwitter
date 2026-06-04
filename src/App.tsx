import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { StoreProvider } from '@/store/Provider';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeTheme } from '@/store/slices/themeSlice';
import { LoginPage, RegisterPage } from '@/pages/Auth';
import { FeedPage } from '@/pages/Feed';
import { ProfilePage } from '@/pages/Profile';
import { ExplorePage } from '@/pages/Explore';
import { AuthInitializer, ProtectedRoute, PublicRoute } from '@/components/common';
import { createAppTheme } from '@/config/theme';
import { ROUTES } from '@/constants/routes';

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const muiTheme = createAppTheme(theme);

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <AuthInitializer>
          <Routes>
            <Route 
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path={ROUTES.REGISTER}
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            
            <Route 
              path={ROUTES.HOME}
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tweet/:id" 
              element={
                <ProtectedRoute>
                  <div>Tweet Detail - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path={ROUTES.EXPLORE} 
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </AuthInitializer>
      </Router>
    </ThemeProvider>
  );
};

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;