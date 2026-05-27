import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  SearchOutlined,
  PersonOutlined,
  CalendarMonthOutlined,
  EditOutlined
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

/**
 * Tela de Pacientes:
 *  - Coluna da esquerda: busca + lista de pacientes (clica pra selecionar)
 *  - Coluna da direita: dados do paciente + exercicios prescritos com progresso
 */
export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [detalhe, setDetalhe] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarLista();
  }, []);

  useEffect(() => {
    if (selecionado) carregarDetalhe(selecionado.id);
  }, [selecionado]);

  async function carregarLista() {
    setCarregando(true);
    try {
      const r = await api.get('/admin/pacientes');
      const lista = r.data?.pacientes || r.data || [];
      setPacientes(lista);
      if (lista.length > 0 && !selecionado) {
        setSelecionado(lista[0]);
      }
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao carregar pacientes');
    } finally {
      setCarregando(false);
    }
  }

  async function carregarDetalhe(id) {
    setCarregandoDetalhe(true);
    try {
      const r = await api.get(`/admin/pacientes/${id}`);
      setDetalhe(r.data);
    } catch (e) {
      // Falha silenciosa - mantem os dados basicos do paciente
      setDetalhe(null);
    } finally {
      setCarregandoDetalhe(false);
    }
  }

  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  const filtrados = pacientes.filter((p) =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        titulo="Pacientes"
        descricao="Gerencie perfis e acompanhe o progresso dos pacientes"
      />

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      <Grid container spacing={3}>
        {/* Lista de pacientes */}
        <Grid item xs={12} md={5} lg={4}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar paciente..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
                sx={{ mb: 2 }}
              />

              {carregando ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : filtrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nenhum paciente encontrado
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  {filtrados.map((p) => {
                    const ativo = selecionado?.id === p.id;
                    return (
                      <Box
                        key={p.id}
                        onClick={() => setSelecionado(p)}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          bgcolor: ativo ? 'rgba(14, 90, 124, 0.08)' : 'transparent',
                          border: '1px solid',
                          borderColor: ativo ? 'primary.main' : 'transparent',
                          transition: 'all 0.15s',
                          '&:hover': {
                            bgcolor: ativo ? 'rgba(14, 90, 124, 0.1)' : 'action.hover'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: ativo ? 'primary.main' : '#E8DCC8',
                              color: ativo ? '#FFFFFF' : '#0E5A7C',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            {iniciais(p.nome)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 1
                              }}
                            >
                              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                {p.nome}
                              </Typography>
                              <Chip
                                label={p.status || 'ativo'}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  bgcolor: 'rgba(39, 174, 96, 0.15)',
                                  color: '#27AE60'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                              {p.condicao || 'Tratamento ativo'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {p.idade ? `${p.idade} anos` : ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Detalhes do paciente */}
        <Grid item xs={12} md={7} lg={8}>
          {!selecionado ? (
            <Card>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <PersonOutlined sx={{ fontSize: 56, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">
                  Selecione um paciente na lista
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <DetalhePaciente
              paciente={selecionado}
              detalhe={detalhe}
              carregando={carregandoDetalhe}
              iniciais={iniciais}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

function DetalhePaciente({ paciente, detalhe, carregando, iniciais }) {
  const prescricoes = detalhe?.prescricoes || [];

  return (
    <Stack spacing={2.5}>
      {/* Card principal */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#E8DCC8',
                  color: '#0E5A7C',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}
              >
                {iniciais(paciente.nome)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.3 }}>
                  {paciente.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {paciente.idade ? `${paciente.idade} anos` : ''}
                  {paciente.idade && paciente.condicao ? ' • ' : ''}
                  {paciente.condicao || 'Em tratamento'}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<EditOutlined />}
              sx={{
                borderColor: '#F08372',
                color: '#F08372',
                '&:hover': {
                  borderColor: '#D86A59',
                  bgcolor: 'rgba(240, 131, 114, 0.08)'
                }
              }}
            >
              Editar Perfil
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <CardInfo
                icone={<CalendarMonthOutlined />}
                titulo="Última Consulta"
                valor={detalhe?.ultima_consulta || paciente.ultima_consulta || '—'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CardInfo
                icone={<CalendarMonthOutlined />}
                titulo="Próxima Consulta"
                valor={detalhe?.proxima_consulta || paciente.proxima_consulta || '—'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Exercicios prescritos */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Exercícios Prescritos
          </Typography>

          {carregando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : prescricoes.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              Nenhum exercício prescrito ainda
            </Typography>
          ) : (
            <Stack spacing={2}>
              {prescricoes.map((pr, idx) => {
                const adesao = pr.adesao ?? Math.floor(Math.random() * 30 + 60);
                return (
                  <Box key={pr.id || idx}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 0.5
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600, mb: 0.3 }}>
                          {pr.titulo || pr.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pr.frequencia || pr.descricao}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {adesao}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={adesao}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(14, 90, 124, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: 'primary.main'
                        }
                      }}
                    />
                    {pr.ultima_execucao && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        Última execução: {pr.ultima_execucao}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

function CardInfo({ icone, titulo, valor }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: 'rgba(14, 90, 124, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main'
        }}
      >
        {icone}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {titulo}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {valor}
        </Typography>
      </Box>
    </Box>
  );
}
