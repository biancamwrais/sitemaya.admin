import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Button,
  Stack
} from '@mui/material';
import {
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  EditOutlined
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

/**
 * Tela de funcionarios. Como o backend nao tem CRUD de funcionarios ainda,
 * usamos dados mockados aqui (atende o requisito visual do desenho).
 */
const FUNCIONARIOS_DEMO = [
  {
    id: 1,
    nome: 'Carla Mendes',
    cargo: 'Secretária',
    email: 'carla.mendes@clinica.com',
    telefone: '(11) 98765-4321',
    localizacao: 'São Paulo, SP',
    horario: 'Segunda a Sexta, 8h - 17h',
    desde: '14/03/2022',
    consultasAgendadas: 245,
    pacientesCadastrados: 89,
    tempoMedioResposta: '15 min',
    atividades: [
      { texto: 'Agendou consulta para João Silva', tempo: '10 min atrás' },
      { texto: 'Cadastrou novo paciente: Maria Santos', tempo: '1h atrás' },
      { texto: 'Confirmou consulta de Pedro Costa', tempo: '2h atrás' }
    ]
  }
];

export default function Funcionarios() {
  const [funcionario] = useState(FUNCIONARIOS_DEMO[0]);

  function iniciais(n) {
    if (!n) return '?';
    const p = n.trim().split(/\s+/);
    return p.length === 1 ? p[0][0] : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  return (
    <Box>
      <PageHeader
        titulo="Funcionários"
        descricao="Gerencie a equipe da clínica e acompanhe o desempenho"
      />

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Cabecalho do funcionario */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
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
                {iniciais(funcionario.nome)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.3 }}>
                  {funcionario.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {funcionario.cargo}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label="ativo"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(39, 174, 96, 0.15)',
                      color: '#27AE60',
                      fontWeight: 700,
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Desde {funcionario.desde}
                  </Typography>
                </Stack>
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

          {/* Cards de contato */}
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <CardContato
                icone={<EmailOutlined />}
                titulo="Email"
                valor={funcionario.email}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardContato
                icone={<PhoneOutlined />}
                titulo="Telefone"
                valor={funcionario.telefone}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardContato
                icone={<LocationOnOutlined />}
                titulo="Localização"
                valor={funcionario.localizacao}
              />
            </Grid>
          </Grid>

          {/* Horario */}
          <Card variant="outlined" sx={{ mb: 2.5, bgcolor: 'background.default', border: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTimeOutlined sx={{ color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Horário de Trabalho
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {funcionario.horario}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Estatisticas */}
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            <Grid item xs={12} sm={4}>
              <CardStat titulo="Consultas Agendadas" valor={funcionario.consultasAgendadas} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardStat titulo="Pacientes Cadastrados" valor={funcionario.pacientesCadastrados} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CardStat titulo="Tempo Médio de Resposta" valor={funcionario.tempoMedioResposta} />
            </Grid>
          </Grid>

          {/* Atividade recente */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Atividade Recente
            </Typography>
            <Stack spacing={1}>
              {funcionario.atividades.map((a, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.2,
                    px: 1.5,
                    borderRadius: 2,
                    bgcolor: 'background.default'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main'
                      }}
                    />
                    <Typography variant="body2">{a.texto}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {a.tempo}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </CardContent>
      </Card>
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
            fontSize: '0.9rem',
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

function CardStat({ titulo, valor }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {titulo}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.3 }}>
        {valor}
      </Typography>
    </Box>
  );
}
