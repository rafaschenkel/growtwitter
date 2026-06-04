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
import { NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from '@/constants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    imgUrl: '',
  });
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    if (formData.name.length > NAME_MAX_LENGTH) {
      setError(`O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres`);
      return false;
    }

    if (formData.username.length > USERNAME_MAX_LENGTH) {
      setError(`O username deve ter no máximo ${USERNAME_MAX_LENGTH} caracteres`);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um e-mail válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      ...formData,
      imgUrl: formData.imgUrl || undefined,
    };
    
    const result = await register(dataToSend);
    
    if (result.success) {
      navigate(ROUTES.LOGIN);
    } else {
      setError(result.error || 'Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <AuthLayout>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Criar sua conta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Nome"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
          slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
          helperText={`${formData.name.length}/${NAME_MAX_LENGTH}`}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Username"
          name="username"
          autoComplete="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          disabled={isLoading}
          slotProps={{ htmlInput: { maxLength: USERNAME_MAX_LENGTH } }}
          helperText={`${formData.username.length}/${USERNAME_MAX_LENGTH}`}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Senha"
          name="password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={isLoading}
          helperText="Mínimo de 6 caracteres"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="URL da Imagem (opcional)"
          name="imgUrl"
          type="url"
          value={formData.imgUrl}
          onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
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
          Criar conta
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Já tem uma conta?{' '}
            <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover">
              Entrar
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
