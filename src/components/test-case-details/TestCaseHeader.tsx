import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
  HourglassEmpty as HourglassEmptyIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  TestCase, 
  TestCaseResult, 
  TestCasePriority, 
  TestCaseStatus 
} from '../../models/interfaces/ITestCase';

interface TestCaseHeaderProps {
  testCase: TestCase;
}

const TestCaseHeader: React.FC<TestCaseHeaderProps> = ({ testCase }) => {
  // Öncelik rengini belirle
  const getPriorityColor = (priority: TestCasePriority) => {
    switch (priority) {
      case TestCasePriority.LOW:
        return 'success';
      case TestCasePriority.MEDIUM:
        return 'info';
      case TestCasePriority.HIGH:
        return 'warning';
      case TestCasePriority.CRITICAL:
        return 'error';
      default:
        return 'default';
    }
  };

  // Durum rengini belirle
  const getStatusColor = (status: TestCaseStatus) => {
    switch (status) {
      case TestCaseStatus.ACTIVE:
        return 'success';
      case TestCaseStatus.DRAFT:
        return 'info';
      case TestCaseStatus.DEPRECATED:
        return 'warning';
      case TestCaseStatus.ARCHIVED:
        return 'default';
      default:
        return 'default';
    }
  };

  // Öncelik adını formatla
  const formatPriority = (priority: TestCasePriority): string => {
    switch (priority) {
      case TestCasePriority.LOW: return 'Düşük';
      case TestCasePriority.MEDIUM: return 'Orta';
      case TestCasePriority.HIGH: return 'Yüksek';
      case TestCasePriority.CRITICAL: return 'Kritik';
      default: return priority;
    }
  };

  // Durum adını formatla
  const formatStatus = (status: TestCaseStatus): string => {
    switch (status) {
      case TestCaseStatus.ACTIVE: return 'Aktif';
      case TestCaseStatus.DRAFT: return 'Taslak';
      case TestCaseStatus.DEPRECATED: return 'Kullanım Dışı';
      case TestCaseStatus.ARCHIVED: return 'Arşivlenmiş';
      default: return status;
    }
  };

  // Sonuç ikonunu belirle
  const getResultIcon = (result?: TestCaseResult) => {
    if (!result) return <HourglassEmptyIcon fontSize="small" color="disabled" />;

    switch (result) {
      case TestCaseResult.PASSED:
        return <CheckCircleIcon fontSize="small" color="success" />;
      case TestCaseResult.FAILED:
        return <CancelIcon fontSize="small" color="error" />;
      case TestCaseResult.BLOCKED:
        return <BlockIcon fontSize="small" color="warning" />;
      case TestCaseResult.SKIPPED:
        return <WarningIcon fontSize="small" color="info" />;
      case TestCaseResult.NOT_RUN:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
      default:
        return <HourglassEmptyIcon fontSize="small" color="disabled" />;
    }
  };

  // Sonuç adını formatla
  const formatResult = (result?: TestCaseResult): string => {
    if (!result) return 'Çalıştırılmadı';

    switch (result) {
      case TestCaseResult.PASSED: return 'Başarılı';
      case TestCaseResult.FAILED: return 'Başarısız';
      case TestCaseResult.BLOCKED: return 'Engellendi';
      case TestCaseResult.SKIPPED: return 'Atlandı';
      case TestCaseResult.NOT_RUN: return 'Çalıştırılmadı';
      default: return result;
    }
  };

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
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Renkli Üst Şerit */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          bgcolor: (theme) => {
            switch (testCase.lastResult) {
              case TestCaseResult.PASSED: return theme.palette.success.main;
              case TestCaseResult.FAILED: return theme.palette.error.main;
              case TestCaseResult.BLOCKED: return theme.palette.warning.main;
              case TestCaseResult.SKIPPED: return theme.palette.info.main;
              default: return theme.palette.grey[300];
            }
          }
        }} 
      />

      {/* Test Case Adı ve ID */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {testCase.id}
        </Typography>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mt: 0.5 }}>
          {testCase.name}
        </Typography>
      </Box>

      {/* Açıklama */}
      <Typography variant="body1" sx={{ mb: 3 }}>
        {testCase.description}
      </Typography>

      {/* Etiketler */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {testCase.tags.map((tag) => (
          <Chip 
            key={tag} 
            label={tag} 
            size="small" 
            variant="outlined" 
            sx={{ borderRadius: 1 }}
          />
        ))}
      </Box>

      {/* Bilgi Kartları */}
      <Grid container spacing={2}>
        {/* Durum */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Durum
            </Typography>
            <Chip 
              label={formatStatus(testCase.status)} 
              size="small" 
              color={getStatusColor(testCase.status) as any}
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        {/* Öncelik */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Öncelik
            </Typography>
            <Chip 
              label={formatPriority(testCase.priority)} 
              size="small" 
              color={getPriorityColor(testCase.priority) as any}
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        {/* Son Çalıştırma */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Son Çalıştırma
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              {getResultIcon(testCase.lastResult)}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatResult(testCase.lastResult)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Kategori */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Kategori
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {testCase.category}
            </Typography>
          </Box>
        </Grid>

        {/* Otomasyon */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Otomasyon
            </Typography>
            <Chip 
              label={testCase.automated ? 'Otomatize' : 'Manuel'} 
              size="small" 
              color={testCase.automated ? 'success' : 'default'}
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>

        {/* Tahmini Süre */}
        <Grid item xs={6} sm={4} md={2}>
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Tahmini Süre
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              <AccessTimeIcon fontSize="small" color="action" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatDuration(testCase.estimatedDuration)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Alt Bilgiler */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        mt: 3, 
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {testCase.createdBy}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            Oluşturulma: {formatDate(testCase.createdAt)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            Güncelleme: {formatDate(testCase.updatedAt)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TestCaseHeader;
