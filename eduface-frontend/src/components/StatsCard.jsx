import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { THEME_COLORS } from '../utils/constants';

export default function StatsCard({ label, value, color = THEME_COLORS.PRIMARY }) {
  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: color, fontSize: '2.5rem' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
