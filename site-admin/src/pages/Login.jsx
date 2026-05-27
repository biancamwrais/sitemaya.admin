import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';

/**
 * Tela de login - fundo azul escuro Maya com logo grande no topo.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.erro
        || err.message
        || 'Falha ao fazer login. Verifique suas credenciais.';
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  }

  // Estilos compartilhados pelos inputs no tema escuro
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 2
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0E5A7C',
        backgroundImage: 'radial-gradient(ellipse at top, #155F82 0%, #0A4A66 100%)',
        px: 2,
        py: 6
      }}
    >
      {/* Logo da clinica */}
      <Box sx={{ mb: 5 }}>
        <Logo variant="login" />
      </Box>

      {/* Card de login */}
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: 700, mb: 0.5, color: '#FFFFFF' }}
          >
            Bem-vinda de volta
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}
          >
            Acesse o painel de gestão
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                E-mail
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                sx={inputSx}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 0.5,
                  display: 'block'
                }}
              >
                Senha
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                sx={inputSx}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    size="small"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': { color: '#E8DCC8' }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    Lembrar-me
                  </Typography>
                }
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                sx={{
                  color: '#E8DCC8',
                  fontWeight: 500,
                  textDecorationColor: 'rgba(232, 220, 200, 0.5)'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Funcionalidade em desenvolvimento');
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            {erro && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  bgcolor: 'rgba(231, 76, 60, 0.15)',
                  color: '#FFB4AB',
                  '& .MuiAlert-icon': { color: '#FFB4AB' }
                }}
              >
                {erro}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={carregando}
              sx={{
                py: 1.5,
                bgcolor: '#E8DCC8',
                color: '#0E5A7C',
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#F2EBDB'
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(232, 220, 200, 0.4)',
                  color: 'rgba(14, 90, 124, 0.6)'
                }
              }}
            >
              {carregando ? <CircularProgress size={22} sx={{ color: '#0E5A7C' }} /> : 'Entrar'}
            </Button>
          </form>

          <Box
            sx={{
              mt: 3,
              p: 1.5,
              bgcolor: 'rgba(232, 220, 200, 0.1)',
              border: '1px solid rgba(232, 220, 200, 0.2)',
              borderRadius: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              <Box component="span" sx={{ color: '#E8DCC8', fontWeight: 700 }}>
                Demo:
              </Box>{' '}
              maya@clinica.com / maya123
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography
        variant="caption"
        sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.5)' }}
      >
        © 2026 Maya Yamamoto RPG. Todos os direitos reservados.
      </Typography>
    </Box>
  );
}
