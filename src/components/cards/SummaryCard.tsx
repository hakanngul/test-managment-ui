import React, { ReactNode } from 'react';
import { 
  Grid, 
  Paper, 
  Box, 
  Typography, 
  Divider, 
  Chip 
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

// Alt kısımdaki satırlar için tip tanımı
export interface SummaryCardItem {
  icon?: ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

// Alt kısımdaki chip için tip tanımı
export interface SummaryCardChip {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

// SummaryCard bileşeni için props tipi
export interface SummaryCardProps {
  title: string;
  mainValue: string | number;
  mainLabel: string;
  items: SummaryCardItem[];
  footerChip?: SummaryCardChip;
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

/**
 * Generic özet kart bileşeni
 * Dashboard ve özet sayfalarında kullanılabilir
 */
const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  mainValue, 
  mainLabel, 
  items, 
  footerChip,
  gridProps = { xs: 12, sm: 6, md: 3 }
}) => {
  const cardContent = (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {mainValue}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {mainLabel}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ mt: 'auto' }}>
        {items.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mb: index < items.length - 1 ? 1 : 0 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {item.icon && (
                <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
              )}
              <Typography variant="body2" color={item.color ? item.color : 'text.primary'}>
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight="medium" color={item.color ? item.color : 'text.primary'}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {footerChip && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Chip
            label={footerChip.label}
            color={footerChip.color || 'default'}
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
      )}
    </Paper>
  );

  // Grid ile sarmalanmış kart
  return (
    <Grid item xs={gridProps.xs} sm={gridProps.sm} md={gridProps.md} lg={gridProps.lg}>
      {cardContent}
    </Grid>
  );
};

export default SummaryCard;
