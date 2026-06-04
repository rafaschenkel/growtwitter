import { Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
          <Paper
            elevation={0}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 4,
              borderRadius: 0,
              borderTopLeftRadius: 8,
              borderEndStartRadius: 8,
              minHeight: '650px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: 'sm'
            }}
            >
            <Typography
              variant="h1"
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                mb: 2,
                letterSpacing: '-0.02em',
                color: 'inherit',
              }}
              >
              Growtwitter
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 500,
                mb: 3,
                opacity: 0.95,
                color: 'inherit',
              }}
              >
             Trabalho final do bloco intermediário
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1rem',
                opacity: 0.85,
                lineHeight: 1.6,
                color: 'inherit',
              }}
              >
              O Growtwitter é a plataforma definitiva para todos os apaixonados por redes sociais que buscam uma experiência familiar e poderosa, semelhante ao Twitter, mas com um toque único. Seja parte desta comunidade que valoriza a liberdade de expressão, a conexão com pessoas de todo o mundo e a disseminação de ideias.
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 0,
              borderTopRightRadius: 8,
              borderEndRightRadius: 8,
              border: '1px solid',
              borderColor: 'divider',
              minHeight: '650px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            >
            {children}
          </Paper>
      </Box>
    </Box>
  );
};
