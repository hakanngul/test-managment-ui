import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  color?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  color
}) => {
  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography color="text.secondary" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" color={color || 'text.primary'}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
