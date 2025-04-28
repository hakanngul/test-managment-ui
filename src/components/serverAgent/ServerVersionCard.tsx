import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider, Grid } from '@mui/material';
import {
  Info as InfoIcon,
  Label as LabelIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

interface ServerVersionCardProps {
  version?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

const ServerVersionCard: React.FC<ServerVersionCardProps> = ({ version, tags, metadata }) => {
  // Sürüm bilgisini parçalara ayır
  const parseVersion = (version?: string) => {
    if (!version) return { major: 'N/A', minor: 'N/A', patch: 'N/A' };
    
    const parts = version.split('.');
    return {
      major: parts[0] || 'N/A',
      minor: parts[1] || 'N/A',
      patch: parts[2] || 'N/A'
    };
  };
  
  const versionParts = parseVersion(version);

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Sunucu Bilgileri
          </Typography>
        </Box>

        {/* Sürüm Bilgisi */}
        <Box sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          mb: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" gutterBottom>
            Sürüm
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {version || 'N/A'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="caption">Major</Typography>
              <Typography variant="body2" fontWeight="medium">{versionParts.major}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="caption">Minor</Typography>
              <Typography variant="body2" fontWeight="medium">{versionParts.minor}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Box sx={{ textAlign: 'center', px: 1 }}>
              <Typography variant="caption">Patch</Typography>
              <Typography variant="body2" fontWeight="medium">{versionParts.patch}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Etiketler */}
        {tags && tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LabelIcon fontSize="small" sx={{ mr: 0.5 }} />
              Etiketler
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Metadata */}
        {metadata && Object.keys(metadata).length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <UpdateIcon fontSize="small" sx={{ mr: 0.5 }} />
              Ek Bilgiler
            </Typography>
            <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2 }}>
              <Grid container spacing={1}>
                {Object.entries(metadata).map(([key, value], index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Typography>
                    </Box>
                    {index < Object.keys(metadata).length - 1 && (
                      <Divider sx={{ my: 0.5 }} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Boş Durum */}
        {(!tags || tags.length === 0) && (!metadata || Object.keys(metadata).length === 0) && (
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            bgcolor: 'background.default',
            textAlign: 'center',
            border: 1,
            borderColor: 'divider'
          }}>
            <Typography variant="body2" color="text.secondary">
              Ek bilgi bulunmuyor
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerVersionCard;
