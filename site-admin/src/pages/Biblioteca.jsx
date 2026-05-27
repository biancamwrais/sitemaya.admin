import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  SearchOutlined,
  AddOutlined,
  AccessTimeOutlined,
  FitnessCenterOutlined,
  PlayArrowOutlined,
  EditOutlined,
  CloseOutlined,
  YouTube
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import api from '../services/api';
import { urlEmbed, urlThumb } from '../utils/youtube';

const CATEGORIAS = ['Alongamento', 'Fortalecimento', 'Respiração', 'Mobilidade'];

export default function Biblioteca() {
  const [exercicios, setExercicios] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Modal "Adicionar/Editar" — quando editando recebe o exercicio inteiro
  const [dialogForm, setDialogForm] = useState({ aberto: false, exercicio: null });

  // Modal "Ver Detalhes"
  const [dialogDetalhe, setDialogDetalhe] = useState({ aberto: false, exercicio: null });

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const r = await api.get('/admin/exercicios');
      setExercicios(r.data?.exercicios || r.data || []);
    } catch (e) {
      setErro(e.response?.data?.erro || 'Erro ao carregar exercícios');
    } finally {
      setCarregando(false);
    }
  }

  const filtrados = exercicios.filter((e) => {
    const matchBusca = (e.titulo || e.nome || '').toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCategoria === 'Todos' || e.categoria === filtroCategoria;
    return matchBusca && matchCat;
  });

  const contagem = (cat) =>
    cat === 'Todos' ? exercicios.length : exercicios.filter((e) => e.categoria === cat).length;

  return (
    <Box>
      <PageHeader
        titulo="Biblioteca de Exercícios"
        descricao={`${exercicios.length} exercícios disponíveis`}
        acao={
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setDialogForm({ aberto: true, exercicio: null })}
          >
            Adicionar Exercício
          </Button>
        }
      />

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      <TextField
        fullWidth
        placeholder="Buscar exercício..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2.5 }}
      />

      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label={`Todos (${contagem('Todos')})`}
          onClick={() => setFiltroCategoria('Todos')}
          color={filtroCategoria === 'Todos' ? 'primary' : 'default'}
          variant={filtroCategoria === 'Todos' ? 'filled' : 'outlined'}
          sx={{ fontWeight: 600 }}
        />
        {CATEGORIAS.map((cat) => (
          <Chip
            key={cat}
            label={`${cat} (${contagem(cat)})`}
            onClick={() => setFiltroCategoria(cat)}
            color={filtroCategoria === cat ? 'primary' : 'default'}
            variant={filtroCategoria === cat ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Stack>

      {carregando ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtrados.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <FitnessCenterOutlined sx={{ fontSize: 56, color: 'text.secondary', mb: 1 }} />
            <Typography color="text.secondary">
              {exercicios.length === 0
                ? 'Nenhum exercício cadastrado ainda'
                : 'Nenhum exercício encontrado nos filtros'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {filtrados.map((ex) => (
            <Grid item xs={12} sm={6} lg={4} key={ex.id}>
              <ExercicioCard
                exercicio={ex}
                onVerDetalhes={() => setDialogDetalhe({ aberto: true, exercicio: ex })}
                onEditar={() => setDialogForm({ aberto: true, exercicio: ex })}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <DialogFormulario
        aberto={dialogForm.aberto}
        exercicio={dialogForm.exercicio}
        onFechar={() => setDialogForm({ aberto: false, exercicio: null })}
        onSalvar={() => {
          setDialogForm({ aberto: false, exercicio: null });
          carregar();
        }}
      />

      <DialogDetalhes
        aberto={dialogDetalhe.aberto}
        exercicio={dialogDetalhe.exercicio}
        onFechar={() => setDialogDetalhe({ aberto: false, exercicio: null })}
        onEditar={(ex) => {
          setDialogDetalhe({ aberto: false, exercicio: null });
          setDialogForm({ aberto: true, exercicio: ex });
        }}
      />
    </Box>
  );
}

function ExercicioCard({ exercicio, onVerDetalhes, onEditar }) {
  const dificuldadeCor = {
    facil: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    fácil: { bg: 'rgba(39, 174, 96, 0.15)', text: '#27AE60' },
    moderado: { bg: 'rgba(243, 156, 18, 0.15)', text: '#F39C12' },
    dificil: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C' },
    difícil: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C' }
  }[(exercicio.dificuldade || 'facil').toLowerCase()] || { bg: 'rgba(107, 123, 140, 0.15)', text: '#6B7B8C' };

  const beneficios = Array.isArray(exercicio.beneficios)
    ? exercicio.beneficios
    : (exercicio.beneficios || '').split(',').map(b => b.trim()).filter(Boolean);

  const thumb = urlThumb(exercicio.video_url);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Thumb do video (se tiver) */}
      {thumb && (
        <Box
          onClick={onVerDetalhes}
          sx={{
            position: 'relative',
            cursor: 'pointer',
            aspectRatio: '16/9',
            bgcolor: '#000',
            backgroundImage: `url(${thumb})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover .play-icon': {
              transform: 'scale(1.1)'
            }
          }}
        >
          <Box
            className="play-icon"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 0, 0, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <PlayArrowOutlined sx={{ color: '#FFF', fontSize: 32, ml: 0.3 }} />
          </Box>
        </Box>
      )}

      <CardContent sx={{ flex: 1, p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
            {exercicio.titulo || exercicio.nome}
          </Typography>
          <IconButton
            size="small"
            onClick={onEditar}
            sx={{ color: '#F08372', mt: -0.5 }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {exercicio.descricao_curta || exercicio.descricao || 'Exercício terapêutico'}
        </Typography>

        <Stack spacing={1} sx={{ mb: 2 }}>
          {exercicio.duracao && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" color="text.primary">{exercicio.duracao}</Typography>
            </Box>
          )}
          {(exercicio.series || exercicio.repeticoes) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FitnessCenterOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="body2" color="text.primary">
                {exercicio.series || ''} {exercicio.repeticoes || ''}
              </Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={exercicio.dificuldade || 'fácil'}
            size="small"
            sx={{
              bgcolor: dificuldadeCor.bg,
              color: dificuldadeCor.text,
              fontWeight: 700
            }}
          />
          {exercicio.categoria && (
            <Chip
              label={exercicio.categoria.toLowerCase()}
              size="small"
              sx={{
                bgcolor: 'rgba(14, 90, 124, 0.1)',
                color: 'primary.main',
                fontWeight: 600
              }}
            />
          )}
          {exercicio.video_url && (
            <Chip
              icon={<YouTube sx={{ color: '#FF0000 !important' }} />}
              label="Vídeo"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 0, 0, 0.1)',
                color: '#FF0000',
                fontWeight: 600
              }}
            />
          )}
        </Stack>

        {beneficios.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Benefícios:
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0, mt: 0.5 }}>
              {beneficios.slice(0, 2).map((b, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.78rem' }}
                >
                  {b}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowOutlined />}
          onClick={onVerDetalhes}
        >
          Ver Detalhes
        </Button>
      </Box>
    </Card>
  );
}

function DialogDetalhes({ aberto, exercicio, onFechar, onEditar }) {
  if (!exercicio) return null;

  const embed = urlEmbed(exercicio.video_url);
  const beneficios = Array.isArray(exercicio.beneficios)
    ? exercicio.beneficios
    : (exercicio.beneficios || '').split(',').map(b => b.trim()).filter(Boolean);

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {exercicio.titulo || exercicio.nome}
        </Typography>
        <IconButton
          onClick={onFechar}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* Video embed */}
        {embed ? (
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 2,
              mb: 3
            }}
          >
            <Box
              component="iframe"
              src={embed}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allowFullScreen
            />
          </Box>
        ) : (
          <Box
            sx={{
              bgcolor: 'background.default',
              p: 3,
              borderRadius: 2,
              mb: 3,
              textAlign: 'center'
            }}
          >
            <YouTube sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Sem vídeo cadastrado. Adicione um link do YouTube ao editar.
            </Typography>
          </Box>
        )}

        {/* Info do exercicio */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <CardInfo titulo="Duração" valor={exercicio.duracao || '—'} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <CardInfo titulo="Séries" valor={exercicio.series || '—'} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <CardInfo titulo="Repetições" valor={exercicio.repeticoes || '—'} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <CardInfo titulo="Dificuldade" valor={exercicio.dificuldade || 'fácil'} />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Descrição
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          {exercicio.descricao || 'Sem descrição detalhada.'}
        </Typography>

        {beneficios.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Benefícios
            </Typography>
            <Box component="ul" sx={{ pl: 3, m: 0, mb: 2 }}>
              {beneficios.map((b, idx) => (
                <Typography key={idx} component="li" variant="body2" color="text.secondary">
                  {b}
                </Typography>
              ))}
            </Box>
          </>
        )}

        {exercicio.instrucoes && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Instruções
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {exercicio.instrucoes}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onFechar} color="inherit">Fechar</Button>
        <Button
          variant="contained"
          startIcon={<EditOutlined />}
          onClick={() => onEditar(exercicio)}
          sx={{
            bgcolor: '#F08372',
            '&:hover': { bgcolor: '#D86A59' }
          }}
        >
          Editar Exercício
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DialogFormulario({ aberto, exercicio, onFechar, onSalvar }) {
  const editando = !!exercicio;

  const [form, setForm] = useState({
    titulo: '',
    categoria: 'Alongamento',
    duracao: '',
    series: '',
    repeticoes: '',
    dificuldade: 'facil',
    video_url: '',
    descricao: '',
    instrucoes: '',
    beneficios: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  // Quando abrir em modo "editar", preenche o form com os dados atuais
  useEffect(() => {
    if (exercicio) {
      setForm({
        titulo: exercicio.titulo || exercicio.nome || '',
        categoria: exercicio.categoria || 'Alongamento',
        duracao: exercicio.duracao || '',
        series: exercicio.series || '',
        repeticoes: exercicio.repeticoes || '',
        dificuldade: exercicio.dificuldade || 'facil',
        video_url: exercicio.video_url || '',
        descricao: exercicio.descricao || '',
        instrucoes: exercicio.instrucoes || '',
        beneficios: Array.isArray(exercicio.beneficios)
          ? exercicio.beneficios.join(', ')
          : (exercicio.beneficios || '')
      });
    } else {
      // Reset quando abrir em modo "adicionar"
      setForm({
        titulo: '', categoria: 'Alongamento', duracao: '',
        series: '', repeticoes: '', dificuldade: 'facil',
        video_url: '', descricao: '', instrucoes: '', beneficios: ''
      });
    }
    setErro('');
  }, [exercicio, aberto]);

  async function handleSalvar() {
    setSalvando(true);
    setErro('');
    try {
      if (editando) {
        await api.put(`/admin/exercicios/${exercicio.id}`, form);
      } else {
        await api.post('/admin/exercicios', form);
      }
      onSalvar();
    } catch (e) {
      setErro(e.response?.data?.erro || `Erro ao ${editando ? 'editar' : 'salvar'} exercício`);
    } finally {
      setSalvando(false);
    }
  }

  // Mostra preview da thumb se o link do YouTube for valido
  const thumbPreview = urlThumb(form.video_url);

  return (
    <Dialog open={aberto} onClose={onFechar} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {editando ? 'Editar Exercício' : 'Adicionar Exercício'}
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            fullWidth
            required
          />

          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Categoria"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              fullWidth
            >
              {CATEGORIAS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Dificuldade"
              value={form.dificuldade}
              onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}
              fullWidth
            >
              <MenuItem value="facil">Fácil</MenuItem>
              <MenuItem value="moderado">Moderado</MenuItem>
              <MenuItem value="dificil">Difícil</MenuItem>
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Duração"
              placeholder="Ex: 15 min"
              value={form.duracao}
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
              fullWidth
            />
            <TextField
              label="Séries"
              placeholder="Ex: 3 séries"
              value={form.series}
              onChange={(e) => setForm({ ...form, series: e.target.value })}
              fullWidth
            />
            <TextField
              label="Repetições"
              placeholder="Ex: 15 reps"
              value={form.repeticoes}
              onChange={(e) => setForm({ ...form, repeticoes: e.target.value })}
              fullWidth
            />
          </Stack>

          {/* Campo de video do YouTube */}
          <TextField
            label="Link do vídeo (YouTube)"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <YouTube sx={{ color: '#FF0000' }} />
                </InputAdornment>
              )
            }}
            helperText="Cole o link do vídeo do YouTube. O paciente verá o vídeo no app."
          />

          {/* Preview da thumbnail */}
          {thumbPreview && (
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Pré-visualização:
              </Typography>
              <Box
                component="img"
                src={thumbPreview}
                alt="Pré-visualização do vídeo"
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  maxHeight: 180,
                  objectFit: 'cover'
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </Box>
          )}

          <TextField
            label="Descrição curta"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />

          <TextField
            label="Instruções passo a passo"
            value={form.instrucoes}
            onChange={(e) => setForm({ ...form, instrucoes: e.target.value })}
            multiline
            rows={3}
            fullWidth
            helperText="Uma instrução por linha"
          />

          <TextField
            label="Benefícios"
            value={form.beneficios}
            onChange={(e) => setForm({ ...form, beneficios: e.target.value })}
            fullWidth
            helperText="Separe por vírgula. Ex: Reduz dor lombar, Melhora flexibilidade"
          />

          {erro && <Alert severity="error">{erro}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onFechar} color="inherit">Cancelar</Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          disabled={salvando || !form.titulo}
        >
          {salvando ? (
            <CircularProgress size={20} color="inherit" />
          ) : editando ? 'Salvar Alterações' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CardInfo({ titulo, valor }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'background.default',
        textAlign: 'center'
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {titulo}
      </Typography>
      <Typography sx={{ fontWeight: 700, color: 'text.primary', mt: 0.3 }}>
        {valor}
      </Typography>
    </Box>
  );
}
