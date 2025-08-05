import React, { useState } from 'react';
import { Box, Typography, Slider, Button, Card } from '@mui/material';

const marks = [
  { value: 12, label: '12 mnd' },
  { value: 24, label: '24 mnd' },
  { value: 36, label: '36 mnd' },
  { value: 48, label: '48 mnd' },
  { value: 60, label: '60 mnd' },
  { value: 72, label: '72 mnd' },
];

export default function LeaseFormMinimal() {
  const [aanbetaling, setAanbetaling] = useState(4200);
  const [looptijd, setLooptijd] = useState(60);

  // Dummy data voor overzicht
  const aanschafwaarde = 28017;
  const btw = 5883;
  const maandbedrag = 446;

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto', mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Zakelijk Leasen</Typography>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>Kies je aanbetaling</Typography>
      <Slider
        value={aanbetaling}
        min={0}
        max={10000}
        step={100}
        onChange={(_, v) => setAanbetaling(v)}
        valueLabelDisplay="on"
        sx={{ mb: 4 }}
      />
      <Typography variant="subtitle2" color="text.secondary" mb={2}>Kies je looptijd</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {marks.map(mark => (
          <Button
            key={mark.value}
            variant={looptijd === mark.value ? 'contained' : 'outlined'}
            onClick={() => setLooptijd(mark.value)}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            {mark.value} mnd
          </Button>
        ))}
      </Box>
      <Card variant="outlined" sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="h6" fontWeight={700}>€ {maandbedrag}/maand</Typography>
        <Typography variant="body2" color="text.secondary">Aanschafwaarde: € {aanschafwaarde.toLocaleString()}</Typography>
        <Typography variant="body2" color="text.secondary">BTW: € {btw.toLocaleString()}</Typography>
      </Card>
      <Button variant="contained" color="primary" size="large" fullWidth sx={{ borderRadius: 3, fontWeight: 700 }}>
        Volgende stap
      </Button>
    </Box>
  );
} 