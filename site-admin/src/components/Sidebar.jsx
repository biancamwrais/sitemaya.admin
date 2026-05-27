import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography
} from '@mui/material';
import {
  DashboardOutlined,
  PeopleAltOutlined,
  CalendarMonthOutlined,
  MenuBookOutlined,
  BadgeOutlined,
  LogoutOutlined,
  DarkModeOutlined,
  LightModeOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTema } from '../contexts/TemaContext';
import Logo from './Logo';

const ITENS = [
  { rotulo: 'Dashboard', icone: <DashboardOutlined />, rota: '/dashboard' },
  { rotulo: 'Pacientes', icone: <PeopleAltOutlined />, rota: '/pacientes' },
  { rotulo: 'Calendário', icone: <CalendarMonthOutlined />, rota: '/calendario' },
  { rotulo: 'Biblioteca', icone: <MenuBookOutlined />, rota: '/biblioteca' },
  { rotulo: 'Funcionários', icone: <BadgeOutlined />, rota: '/funcionarios' }
];

const SIDEBAR_WIDTH = 256;

// A sidebar e sempre azul Maya, independente do tema claro/escuro.
// O botao "Modo Noturno" controla o TEMA DO RESTANTE da pagina.
const COR_FUNDO = '#0E5A7C';
const COR_HOVER = 'rgba(255, 255, 255, 0.08)';
const COR_ATIVO_BG = '#E8DCC8';
const COR_ATIVO_TEXTO = '#0E5A7C';
const COR_TEXTO_NORMAL = 'rgba(255, 255, 255, 0.85)';
const COR_TEXTO_DIM = 'rgba(255, 255, 255, 0.55)';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { modo, alternar } = useTema();

  function iniciais(nome) {
    if (!nome) return '?';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  return (
    <Box
      component="aside"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        bgcolor: COR_FUNDO,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        py: 3,
        px: 2.5
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, py: 1 }}>
        <Logo variant="sidebar" />
      </Box>

      <List sx={{ flex: 1, px: 0 }}>
        {ITENS.map((item) => {
          const ativo = location.pathname.startsWith(item.rota);
          return (
            <ListItemButton
              key={item.rota}
              onClick={() => navigate(item.rota)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.2,
                bgcolor: ativo ? COR_ATIVO_BG : 'transparent',
                color: ativo ? COR_ATIVO_TEXTO : COR_TEXTO_NORMAL,
                transition: 'all 0.15s ease',
                '&:hover': { bgcolor: ativo ? COR_ATIVO_BG : COR_HOVER }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                {item.icone}
              </ListItemIcon>
              <ListItemText
                primary={item.rotulo}
                primaryTypographyProps={{
                  fontWeight: ativo ? 700 : 500,
                  fontSize: '0.92rem'
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box>
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Botao Modo Noturno (claro/escuro) */}
        <ListItemButton
          onClick={alternar}
          sx={{
            borderRadius: 2,
            mb: 1,
            color: COR_TEXTO_NORMAL,
            '&:hover': { bgcolor: COR_HOVER }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
            {modo === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </ListItemIcon>
          <ListItemText
            primary={modo === 'dark' ? 'Modo Claro' : 'Modo Noturno'}
            primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: 500 }}
          />
        </ListItemButton>

        {/* Card do usuario */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1.5,
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
          }}
          onClick={() => navigate('/perfil')}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              fontSize: '0.85rem',
              bgcolor: '#E8DCC8',
              color: '#0E5A7C',
              fontWeight: 700
            }}
          >
            {iniciais(user?.nome)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                lineHeight: 1.2,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.nome || 'Profissional'}
            </Typography>
            <Typography
              sx={{ fontSize: '0.72rem', color: COR_TEXTO_DIM, lineHeight: 1.2 }}
            >
              {user?.perfil === 'ADMIN' ? 'Administrador' : 'Fisioterapeuta RPG'}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            mt: 1.5,
            color: '#F08372',
            '&:hover': { bgcolor: 'rgba(240, 131, 114, 0.1)' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#F08372' }}>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText
            primary="Sair"
            primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}
