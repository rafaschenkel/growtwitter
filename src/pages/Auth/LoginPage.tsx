import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.login || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate(ROUTES.HOME, { replace: true });
    } else {
      setError(result.error || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Entrar no Growtwitter
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="E-mail ou nome de usuário"
          name="login"
          autoComplete="username"
          autoFocus
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ mb: 2, py: 1.5 }}
        >
          Entrar
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Não tem uma conta?{' '}
            <Link component={RouterLink} to={ROUTES.REGISTER} underline="hover">
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </Box>

      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            gap: 2,
          }}
        >
          <CircularProgress size={60} sx={{ color: 'white' }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Aguarde...
          </Typography>
        </Box>
      )}
    </AuthLayout>
  );
};
