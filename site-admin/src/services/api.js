import axios from 'axios';

/**
 * Cliente HTTP do site admin. O backend do Maya RPG roda em
 * https://backend-maya-cydf-mayarpg.vercel.app por padrao. Ajuste em .env se necessario.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-maya-cydf-mayarpg.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adiciona o token JWT automaticamente em todas as requisicoes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('maya_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se receber 401, faz logout e redireciona pro login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('maya_admin_token');
      localStorage.removeItem('maya_admin_user');
      // Se nao estiver ja na pagina de login, redireciona
      if (!window.location.pathname.includes('login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
