import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TemaProvider } from './contexts/TemaContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Calendario from './pages/Calendario';
import Biblioteca from './pages/Biblioteca';
import Funcionarios from './pages/Funcionarios';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pacientes" element={<Pacientes />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/biblioteca" element={<Biblioteca />} />
              <Route path="/funcionarios" element={<Funcionarios />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TemaProvider>
  );
}
