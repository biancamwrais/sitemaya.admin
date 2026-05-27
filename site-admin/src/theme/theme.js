import { createTheme } from '@mui/material/styles';

/**
 * Cria o tema do MUI no modo claro ou escuro.
 *
 * Cores oficiais Maya RPG:
 *  - Azul Maya  #0E5A7C  (cor principal)
 *  - Bege Maya  #E8DCC8  (destaque, hover)
 *  - Coral      #F08372  (botoes editar, sair)
 *  - Marrom     #7A4A2A  (gradientes)
 */
export function criarTema(modo = 'light') {
  const escuro = modo === 'dark';

  return createTheme({
    palette: {
      mode: modo,
      primary: {
        main: '#0E5A7C',
        light: '#3A7E9C',
        dark: '#08405A',
        contrastText: '#FFFFFF'
      },
      secondary: {
        main: '#E8DCC8',
        light: '#F2EBDB',
        dark: '#C5B898',
        contrastText: '#0E5A7C'
      },
      error: { main: '#E74C3C' },
      warning: { main: '#F39C12' },
      success: { main: '#27AE60' },
      info: { main: '#3DB5B0' },
      background: {
        default: escuro ? '#0A1929' : '#F5F1EA',
        paper: escuro ? '#132F4C' : '#FFFFFF'
      },
      text: {
        primary: escuro ? '#FFFFFF' : '#1A2B3C',
        secondary: escuro ? 'rgba(255,255,255,0.7)' : '#6B7B8C'
      },
      divider: escuro ? 'rgba(255,255,255,0.12)' : 'rgba(0, 0, 0, 0.08)'
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem' },
      h2: { fontWeight: 700, fontSize: '2rem' },
      h3: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.5px' },
      h4: { fontWeight: 600, fontSize: '1.5rem' },
      h5: { fontWeight: 600, fontSize: '1.25rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      body1: { fontSize: '0.95rem' },
      body2: { fontSize: '0.85rem' },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 20px',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 2px 8px rgba(14, 90, 124, 0.2)' }
          }
        }
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: escuro
              ? '0 2px 12px rgba(0, 0, 0, 0.4)'
              : '0 2px 12px rgba(14, 90, 124, 0.06)',
            border: escuro
              ? '1px solid rgba(255, 255, 255, 0.06)'
              : '1px solid rgba(14, 90, 124, 0.04)'
          }
        }
      },
      MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: escuro ? 'rgba(255,255,255,0.05)' : '#FFFFFF'
          }
        }
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 500, fontSize: '0.75rem' } } }
    }
  });
}
