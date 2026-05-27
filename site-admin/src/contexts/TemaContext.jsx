import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { criarTema } from '../theme/theme';

const TemaContext = createContext(null);

/**
 * Provider de tema com persistencia em localStorage.
 * A escolha do usuario fica salva entre sessoes.
 */
export function TemaProvider({ children }) {
  const [modo, setModo] = useState(() => {
    return localStorage.getItem('maya_admin_tema') || 'light';
  });

  const tema = useMemo(() => criarTema(modo), [modo]);

  useEffect(() => {
    localStorage.setItem('maya_admin_tema', modo);
  }, [modo]);

  function alternar() {
    setModo((m) => (m === 'light' ? 'dark' : 'light'));
  }

  return (
    <TemaContext.Provider value={{ modo, alternar }}>
      <ThemeProvider theme={tema}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </TemaContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema precisa ser usado dentro de TemaProvider');
  return ctx;
}
