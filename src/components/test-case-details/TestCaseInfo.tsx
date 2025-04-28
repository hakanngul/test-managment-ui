import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Public as PublicIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@mui/icons-material';
import { TestCase } from '../../models/interfaces/ITestCase';

interface TestCaseInfoProps {
  testCase: TestCase;
}

const TestCaseInfo: React.FC<TestCaseInfoProps> = ({ testCase }) => {
  // Tarihi formatla
  const formatDate = (date?: Date): string => {
    if (!date) return '-';
    return new Date(date).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Süreyi formatla
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '-';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} saniye`;
    }
    
    return `${minutes} dakika ${remainingSeconds} saniye`;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Temel Bilgiler */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Temel Bilgiler
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body2">
                    {testCase.id}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Proje ID
                  </Typography>
                  <Typography variant="body2">
                    {testCase.projectId}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Test Suite ID
                  </Typography>
                  <Typography variant="body2">
                    {testCase.testSuiteId || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Oluşturan
                  </Typography>
                  <Typography variant="body2">
                    {testCase.createdBy}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Oluşturulma Tarihi
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(testCase.createdAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Son Güncelleme
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(testCase.updatedAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Son Çalıştırma
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(testCase.lastRun) || '-'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tahmini Süre
                  </Typography>
                  <Typography variant="body2">
                    {formatDuration(testCase.estimatedDuration)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Gerçek Süre
                  </Typography>
                  <Typography variant="body2">
                    {formatDuration(testCase.actualDuration) || '-'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Çalıştırma Ortamı */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Çalıştırma Ortamı
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ComputerIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                  Tarayıcı:
                </Typography>
                <Typography variant="body2">
                  {testCase.browser || 'Belirtilmemiş'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PublicIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mr: 1 }}>
                  Ortam:
                </Typography>
                <Typography variant="body2">
                  {testCase.environment || 'Belirtilmemiş'}
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                Ön Koşullar
              </Typography>
              
              {testCase.prerequisites && testCase.prerequisites.length > 0 ? (
                <List dense disablePadding>
                  {testCase.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <CheckCircleOutlineIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={prerequisite} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Ön koşul belirtilmemiş
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Etiketler */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Etiketler
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {testCase.tags && testCase.tags.length > 0 ? (
                  testCase.tags.map((tag) => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      variant="outlined" 
                      sx={{ borderRadius: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Etiket belirtilmemiş
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TestCaseInfo;
