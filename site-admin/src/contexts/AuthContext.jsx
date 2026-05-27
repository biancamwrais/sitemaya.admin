import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restaura sessao do localStorage ao iniciar
    const token = localStorage.getItem('maya_admin_token');
    const savedUser = localStorage.getItem('maya_admin_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, usuario } = response.data;

    // So permite login se for ADMIN ou PROFISSIONAL (nao paciente)
    if (usuario.perfil !== 'ADMIN' && usuario.perfil !== 'PROFISSIONAL') {
      throw new Error('Acesso restrito a administradores e profissionais.');
    }

    localStorage.setItem('maya_admin_token', token);
    localStorage.setItem('maya_admin_user', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  function logout() {
    localStorage.removeItem('maya_admin_token');
    localStorage.removeItem('maya_admin_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de AuthProvider');
  return ctx;
}
