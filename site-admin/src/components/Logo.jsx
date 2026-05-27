import { Box } from '@mui/material';

/**
 * Logo oficial da Clinica Maya Yamamoto RPG.
 *
 * IMPORTANTE: a imagem precisa estar em `public/logo-maya.jpeg`.
 * O Vite serve arquivos da pasta public/ na raiz, entao o src e apenas /logo-maya.jpeg
 *
 * Variantes:
 *  - 'sidebar': logo compacta (140px largura) para a sidebar escura
 *  - 'login':   logo grande (320px) para a tela de login
 *  - 'compact': mini (60px) para casos onde so cabe o icone
 */
export default function Logo({ variant = 'sidebar' }) {
  const sizes = {
    sidebar: { width: 160 },
    login: { width: 360 },
    compact: { width: 80 }
  };

  return (
    <Box
      component="img"
      src="/logo-maya.jpeg"
      alt="Maya Yamamoto RPG"
      sx={{
        ...sizes[variant],
        height: 'auto',
        display: 'block',
        userSelect: 'none',
        pointerEvents: 'none'
      }}
    />
  );
}
