import { Box, Typography, Card, CardContent } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';

/**
 * Placeholder generico para telas que serao implementadas nas partes 2 e 3.
 */
export default function Placeholder({ titulo, descricao }) {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {descricao}
      </Typography>

      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8
          }}
        >
          <ConstructionOutlined
            sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Em desenvolvimento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta tela será implementada na próxima entrega.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
