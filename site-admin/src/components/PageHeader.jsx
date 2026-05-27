import { Box, Typography } from '@mui/material';

/**
 * Header padrao para todas as paginas: titulo grande + subtitulo + acao opcional.
 */
export default function PageHeader({ titulo, descricao, acao }) {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap'
      }}
    >
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
          {titulo}
        </Typography>
        {descricao && (
          <Typography variant="body2" color="text.secondary">
            {descricao}
          </Typography>
        )}
      </Box>
      {acao && <Box>{acao}</Box>}
    </Box>
  );
}
