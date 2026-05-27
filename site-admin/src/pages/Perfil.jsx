import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Stack,
  Divider
} from '@mui/material';
import {
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  EditOutlined,
  SchoolOutlined,
  WorkspacePremiumOutlined
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const { user } = useAuth();

  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  return (
    <Box>
      <PageHeader
        titulo="Perfil Profissional"
        descricao="Informações e credenciais profissionais"
      />

      <Stack spacing={2.5}>
        {/* Card principal */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 3,
                flexWrap: 'wrap',
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1, minWidth: 0 }}>
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    background: 'linear-gradient(135deg, #3DB5B0 0%, #7A4A2A 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '2rem'
                  }}
                >
                  {iniciais(user?.nome || 'Maya Yamamoto')}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {user?.nome || 'Dra. Maya Yamamoto'}
                  </Typography>
                  <Typography
                    sx={{ color: '#F08372', fontWeight: 600, mb: 1 }}
                  >
                    Fisioterapeuta RPG
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CREFITO-3/12345-F
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

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              Fisioterapeuta especializada em Reeducação Postural Global (RPG)
              com mais de 9 anos de experiência no tratamento de disfunções
              posturais, dores crônicas e lesões musculoesqueléticas.
            </Typography>

            {/* Cards de contato */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <CardContato
                  icone={<EmailOutlined />}
                  titulo="Email"
                  valor={user?.email || 'maya.yamamoto@clinica.com'}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CardContato
                  icone={<PhoneOutlined />}
                  titulo="Telefone"
                  valor="(11) 98765-0000"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CardContato
                  icone={<LocationOnOutlined />}
                  titulo="Endereço"
                  valor="Rua das Flores, 123 - São Paulo, SP"
                />
              </Grid>
            </Grid>

            {/* Estatisticas */}
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <CardStat titulo="Pacientes Atendidos" valor="487" cor="primary.main" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <CardStat titulo="Anos de Experiência" valor="9" cor="#F08372" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <CardStat titulo="Satisfação" valor="98%" cor="#3DB5B0" />
              </Grid>
              <Grid item xs={6} sm={3}>
                <CardStat titulo="Sessões Realizadas" valor="3.254" cor="info.main" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Formacao e Certificacoes */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SchoolOutlined sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Formação Acadêmica
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  <ItemListado
                    titulo="Especialização em RPG"
                    subtitulo="Instituto Paulista de Estudos RPG"
                    ano="2017"
                  />
                  <Divider />
                  <ItemListado
                    titulo="Graduação em Fisioterapia"
                    subtitulo="Universidade de São Paulo - USP"
                    ano="2014"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <WorkspacePremiumOutlined sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Certificações e Especializações
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  <ItemBullet texto="Reeducação Postural Global (RPG)" />
                  <ItemBullet texto="Pilates Terapêutico" />
                  <ItemBullet texto="Osteopatia Aplicada" />
                  <ItemBullet texto="Avaliação Postural Computadorizada" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

function CardContato({ icone, titulo, valor }) {
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
      <Box sx={{ color: 'primary.main' }}>{icone}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {titulo}
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {valor}
        </Typography>
      </Box>
    </Box>
  );
}

function CardStat({ titulo, valor, cor }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.default',
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, color: cor }}>
        {valor}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {titulo}
      </Typography>
    </Box>
  );
}

function ItemListado({ titulo, subtitulo, ano }) {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
    >
      <Box>
        <Typography sx={{ fontWeight: 600 }}>{titulo}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitulo}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
        {ano}
      </Typography>
    </Box>
  );
}

function ItemBullet({ texto }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          flexShrink: 0
        }}
      />
      <Typography variant="body2">{texto}</Typography>
    </Box>
  );
}
