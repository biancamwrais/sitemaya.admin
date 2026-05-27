import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarMonthOutlined,
  GroupsOutlined,
  TrendingUpOutlined,
  AccessTimeOutlined
} from '@mui/icons-material';
import api from '../services/api';

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const r = await api.get('/admin/dashboard');
      setDados(r.data);
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao carregar dashboard');
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const estatisticas = dados?.estatisticas || {};
  const proximas = dados?.proximasConsultas || dados?.proximas_consultas || [];
  const atividades = dados?.atividadeRecente || [];

  const dataFormatada = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const cards = [
    {
      titulo: 'Consultas do Mês',
      valor: estatisticas.consultas_mes ?? 0,
      variacao: '+12%',
      bg: 'rgba(14, 90, 124, 0.1)',
      icone: <CalendarMonthOutlined sx={{ color: '#3DB5B0', fontSize: 24 }} />
    },
    {
      titulo: 'Atendimentos da Semana',
      valor: estatisticas.atendimentos_semana ?? 0,
      variacao: '+8%',
      bg: 'rgba(122, 74, 42, 0.15)',
      icone: <GroupsOutlined sx={{ color: '#C18B5A', fontSize: 24 }} />
    },
    {
      titulo: 'Taxa de Retorno',
      valor: `${estatisticas.taxa_retorno ?? 0}%`,
      variacao: '+5%',
      bg: 'rgba(61, 181, 176, 0.15)',
      icone: <TrendingUpOutlined sx={{ color: '#3DB5B0', fontSize: 24 }} />
    },
    {
      titulo: 'Tempo Médio',
      valor: `${estatisticas.tempo_medio ?? 45}min`,
      variacao: '-2min',
      bg: 'rgba(240, 131, 114, 0.15)',
      icone: <AccessTimeOutlined sx={{ color: '#F08372', fontSize: 24 }} />
    }
  ];

  return (
    <Box>
      {/* IMPORTANTE: usar 'text.primary' (cor do tema) em vez de cor hardcoded */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visão geral da clínica - {dataFormatada}
        </Typography>
      </Box>

      {erro && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {erro}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} lg={3} key={c.titulo}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: c.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {c.icone}
                  </Box>
                  <Chip
                    label={c.variacao}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(39, 174, 96, 0.15)',
                      color: '#27AE60',
                      fontWeight: 700,
                      height: 24,
                      fontSize: '0.72rem'
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '2rem',
                    lineHeight: 1.1,
                    mb: 0.5,
                    color: 'text.primary'
                  }}
                >
                  {c.valor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.titulo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                Próximas Consultas
              </Typography>

              {proximas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhuma consulta agendada
                  </Typography>
                </Box>
              ) : (
                proximas.slice(0, 5).map((consulta, idx) => (
                  <ConsultaItem key={consulta.id || idx} consulta={consulta} />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                Atividade Recente
              </Typography>

              {atividades.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Sem atividades recentes
                  </Typography>
                </Box>
              ) : (
                atividades.slice(0, 5).map((a, idx) => (
                  <AtividadeItem key={idx} atividade={a} />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function ConsultaItem({ consulta }) {
  const status = (consulta.status || '').toLowerCase();
  const corStatus = {
    confirmado: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    confirmada: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    pendente: { bg: 'rgba(243, 156, 18, 0.15)', text: '#F39C12' },
    cancelado: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C' }
  }[status] || { bg: 'rgba(107, 123, 140, 0.15)', text: '#6B7B8C' };

  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.75,
        borderTop: '1px solid',
        borderColor: 'divider',
        '&:first-of-type': { borderTop: 'none', pt: 0 }
      }}
    >
      <Avatar sx={{ bgcolor: '#E8DCC8', color: '#0E5A7C', fontWeight: 700, fontSize: '0.85rem' }}>
        {iniciais(consulta.paciente_nome)}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: 'text.primary' }}>
          {consulta.paciente_nome || 'Paciente'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {consulta.servico_nome || consulta.servico || 'Consulta'}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>
          {consulta.hora || ''}
        </Typography>
        <Chip
          label={status || 'agendado'}
          size="small"
          sx={{
            bgcolor: corStatus.bg,
            color: corStatus.text,
            fontWeight: 700,
            mt: 0.5,
            height: 22,
            fontSize: '0.7rem'
          }}
        />
      </Box>
    </Box>
  );
}

function AtividadeItem({ atividade }) {
  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.5 }}>
      <Avatar
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          fontSize: '0.75rem',
          width: 36,
          height: 36,
          fontWeight: 700
        }}
      >
        {iniciais(atividade.paciente)}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.4, color: 'text.primary' }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {atividade.paciente}
          </Box>{' '}
          {atividade.descricao}
        </Typography>
        {atividade.detalhe && (
          <Typography variant="caption" color="text.secondary">
            {atividade.detalhe}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3 }}>
          {atividade.tempo}
        </Typography>
      </Box>
    </Box>
  );
}
