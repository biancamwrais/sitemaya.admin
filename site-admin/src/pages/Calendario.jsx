import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Stack,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  AccessTimeOutlined,
  BlockOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarMonthOutlined,
  EventNoteOutlined,
  MarkEmailUnreadOutlined
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import api from '../services/api';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function Calendario() {
  const hoje = new Date();
  const [aba, setAba] = useState(0);
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());
  const [agendamentos, setAgendamentos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [diasBloqueados, setDiasBloqueados] = useState(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Modal de confirmacao para aceitar/recusar
  const [modalAcao, setModalAcao] = useState({ aberto: false, solicitacao: null, acao: null });

  useEffect(() => { carregar(); }, [mesAtual, anoAtual]);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const inicio = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-01`;
      const r = await api.get('/admin/agendamentos', { params: { mes: inicio } });
      const lista = r.data?.agendamentos || r.data || [];

      // Separa agendamentos confirmados das solicitacoes pendentes
      setAgendamentos(lista.filter(a => (a.origem || '').toUpperCase() !== 'SOLICITACAO' || a.status !== 'pendente'));
      setSolicitacoes(lista.filter(a => (a.origem || '').toUpperCase() === 'SOLICITACAO' && a.status === 'pendente'));
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao carregar agenda');
      setAgendamentos([]);
      setSolicitacoes([]);
    } finally {
      setCarregando(false);
    }
  }

  async function responderSolicitacao(solicitacao, acao) {
    try {
      const novoStatus = acao === 'aceitar' ? 'confirmado' : 'cancelado';
      await api.put(`/admin/agendamentos/${solicitacao.id}/status`, { status: novoStatus });
      setModalAcao({ aberto: false, solicitacao: null, acao: null });
      carregar();
    } catch (e) {
      alert(e.response?.data?.erro || 'Erro ao processar solicitação');
    }
  }

  function mesAnterior() {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(anoAtual - 1); }
    else setMesAtual(mesAtual - 1);
  }

  function mesProximo() {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(anoAtual + 1); }
    else setMesAtual(mesAtual + 1);
  }

  function toggleBloqueio(dia) {
    setDiasBloqueados((prev) => {
      const novo = new Set(prev);
      const chave = `${anoAtual}-${mesAtual}-${dia}`;
      if (novo.has(chave)) novo.delete(chave); else novo.add(chave);
      return novo;
    });
  }

  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const diaSemanaInicio = new Date(anoAtual, mesAtual, 1).getDay();
  const dataSelecionada = new Date(anoAtual, mesAtual, diaSelecionado);

  const consultasDoDia = agendamentos.filter((a) => {
    if (!a.data) return false;
    const d = new Date(a.data);
    return d.getDate() === diaSelecionado && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
  });

  function temAgendamento(dia) {
    return agendamentos.some((a) => {
      if (!a.data) return false;
      const d = new Date(a.data);
      return d.getDate() === dia && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
  }

  const ehHoje = (dia) =>
    dia === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear();
  const ehBloqueado = (dia) => diasBloqueados.has(`${anoAtual}-${mesAtual}-${dia}`);

  return (
    <Box>
      <PageHeader
        titulo="Calendário"
        descricao="Gerencie sua agenda e responda solicitações de consulta"
      />

      {/* Tabs: Agenda vs Solicitacoes Pendentes */}
      <Tabs
        value={aba}
        onChange={(_, v) => setAba(v)}
        sx={{
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '& .MuiTab-root': { fontWeight: 600, textTransform: 'none' }
        }}
      >
        <Tab
          icon={<EventNoteOutlined />}
          iconPosition="start"
          label="Agenda"
        />
        <Tab
          icon={
            <Badge badgeContent={solicitacoes.length} color="error">
              <MarkEmailUnreadOutlined />
            </Badge>
          }
          iconPosition="start"
          label="Solicitações"
        />
      </Tabs>

      {erro && <Alert severity="warning" sx={{ mb: 3 }}>{erro}</Alert>}

      {aba === 0 ? (
        // ABA AGENDA
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {MESES[mesAtual]} {anoAtual}
                  </Typography>
                  <Box>
                    <IconButton onClick={mesAnterior}><ChevronLeftOutlined /></IconButton>
                    <IconButton onClick={mesProximo}><ChevronRightOutlined /></IconButton>
                  </Box>
                </Box>

                <Grid container columns={7} sx={{ mb: 1 }}>
                  {DIAS.map((d) => (
                    <Grid item xs={1} key={d}>
                      <Typography
                        align="center"
                        variant="body2"
                        sx={{ fontWeight: 600, color: 'text.secondary', py: 1 }}
                      >
                        {d}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Grid container columns={7} spacing={0.5}>
                  {Array.from({ length: diaSemanaInicio }).map((_, i) => (
                    <Grid item xs={1} key={`vazio-${i}`} />
                  ))}

                  {Array.from({ length: diasNoMes }, (_, i) => i + 1).map((dia) => {
                    const selecionado = dia === diaSelecionado;
                    const bloqueado = ehBloqueado(dia);
                    const temAg = temAgendamento(dia);
                    const hoje_ = ehHoje(dia);

                    return (
                      <Grid item xs={1} key={dia}>
                        <Box
                          onClick={() => !bloqueado && setDiaSelecionado(dia)}
                          sx={{
                            aspectRatio: '1/1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1.5,
                            cursor: bloqueado ? 'not-allowed' : 'pointer',
                            position: 'relative',
                            bgcolor: bloqueado
                              ? 'rgba(231, 76, 60, 0.1)'
                              : selecionado
                                ? 'primary.main'
                                : hoje_
                                  ? 'rgba(14, 90, 124, 0.1)'
                                  : 'transparent',
                            color: bloqueado
                              ? 'error.main'
                              : selecionado
                                ? 'common.white'
                                : 'text.primary',
                            fontWeight: selecionado || hoje_ ? 700 : 500,
                            textDecoration: bloqueado ? 'line-through' : 'none',
                            transition: 'all 0.15s',
                            '&:hover': bloqueado ? {} : {
                              bgcolor: selecionado ? 'primary.dark' : 'action.hover'
                            }
                          }}
                        >
                          <Typography sx={{ fontWeight: 'inherit', fontSize: '0.95rem' }}>
                            {dia}
                          </Typography>
                          {temAg && !selecionado && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                width: 4,
                                height: 4,
                                borderRadius: '50%',
                                bgcolor: 'primary.main'
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.3, color: 'text.primary' }}>
                  Consultas do Dia
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {DIAS[dataSelecionada.getDay()].toLowerCase()},{' '}
                  {diaSelecionado} de {MESES[mesAtual].toLowerCase()}
                </Typography>

                {carregando ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : consultasDoDia.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    Nenhuma consulta agendada
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {consultasDoDia.map((c, idx) => (
                      <ConsultaCard key={c.id || idx} consulta={c} />
                    ))}
                  </Stack>
                )}

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BlockOutlined />}
                  onClick={() => toggleBloqueio(diaSelecionado)}
                  sx={{
                    mt: 2,
                    borderColor: '#F08372',
                    color: '#F08372',
                    '&:hover': { borderColor: '#D86A59', bgcolor: 'rgba(240, 131, 114, 0.08)' }
                  }}
                >
                  {ehBloqueado(diaSelecionado) ? 'Desbloquear este dia' : 'Bloquear este dia'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        // ABA SOLICITACOES PENDENTES
        <SolicitacoesPendentes
          solicitacoes={solicitacoes}
          carregando={carregando}
          onAcao={(s, a) => setModalAcao({ aberto: true, solicitacao: s, acao: a })}
        />
      )}

      {/* Modal de confirmacao aceitar/recusar */}
      <Dialog
        open={modalAcao.aberto}
        onClose={() => setModalAcao({ aberto: false, solicitacao: null, acao: null })}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {modalAcao.acao === 'aceitar' ? 'Aceitar solicitação?' : 'Recusar solicitação?'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {modalAcao.acao === 'aceitar'
              ? `Tem certeza que quer aceitar a consulta de ${modalAcao.solicitacao?.paciente_nome || 'este paciente'}? O paciente receberá uma notificação confirmando.`
              : `Tem certeza que quer recusar a consulta de ${modalAcao.solicitacao?.paciente_nome || 'este paciente'}? O paciente receberá uma notificação.`}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setModalAcao({ aberto: false, solicitacao: null, acao: null })}
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={modalAcao.acao === 'aceitar' ? 'success' : 'error'}
            onClick={() => responderSolicitacao(modalAcao.solicitacao, modalAcao.acao)}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SolicitacoesPendentes({ solicitacoes, carregando, onAcao }) {
  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (solicitacoes.length === 0) {
    return (
      <Card>
        <CardContent sx={{ py: 8, textAlign: 'center' }}>
          <MarkEmailUnreadOutlined sx={{ fontSize: 56, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
            Nenhuma solicitação pendente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quando um paciente solicitar consulta pelo app, aparece aqui pra você aceitar ou recusar.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        Estas solicitações foram feitas pelos pacientes pelo app mobile. Ao
        aceitar, o paciente recebe uma notificação push de confirmação.
      </Alert>

      {solicitacoes.map((s) => (
        <SolicitacaoCard key={s.id} solicitacao={s} onAcao={onAcao} />
      ))}
    </Stack>
  );
}

function SolicitacaoCard({ solicitacao, onAcao }) {
  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  function formatarData(dataStr) {
    if (!dataStr) return '—';
    const d = new Date(dataStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return (
    <Card>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#E8DCC8',
              color: '#0E5A7C',
              fontWeight: 700
            }}
          >
            {iniciais(solicitacao.paciente_nome)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>
                {solicitacao.paciente_nome || 'Paciente'}
              </Typography>
              <Chip
                label="pendente"
                size="small"
                sx={{
                  bgcolor: 'rgba(243, 156, 18, 0.15)',
                  color: '#F39C12',
                  fontWeight: 700,
                  height: 20,
                  fontSize: '0.65rem'
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonthOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatarData(solicitacao.data)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {solicitacao.hora || '—'}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              <Box component="span" sx={{ fontWeight: 600 }}>Serviço:</Box>{' '}
              {solicitacao.servico_nome || solicitacao.servico || 'Consulta'}
            </Typography>

            {solicitacao.observacoes && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, p: 1, borderRadius: 1, bgcolor: 'background.default' }}
              >
                "{solicitacao.observacoes}"
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CloseOutlined />}
              onClick={() => onAcao(solicitacao, 'recusar')}
              size="small"
            >
              Recusar
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckOutlined />}
              onClick={() => onAcao(solicitacao, 'aceitar')}
              size="small"
            >
              Aceitar
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

function ConsultaCard({ consulta }) {
  const status = (consulta.status || '').toLowerCase();
  const corStatus = {
    confirmado: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    confirmada: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    pendente: { bg: 'rgba(243, 156, 18, 0.15)', text: '#F39C12' }
  }[status] || { bg: 'rgba(107, 123, 140, 0.15)', text: '#6B7B8C' };

  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  return (
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#E8DCC8', color: '#0E5A7C', fontWeight: 700, width: 32, height: 32, fontSize: '0.75rem' }}>
          {iniciais(consulta.paciente_nome)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>
            {consulta.paciente_nome || 'Paciente'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {consulta.servico_nome || consulta.servico || 'Consulta'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
            <AccessTimeOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {consulta.hora || ''}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={status || 'agendado'}
          size="small"
          sx={{
            bgcolor: corStatus.bg,
            color: corStatus.text,
            fontWeight: 700,
            height: 20,
            fontSize: '0.65rem'
          }}
        />
      </Box>
    </Box>
  );
}
