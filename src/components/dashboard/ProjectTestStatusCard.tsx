import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Chip
} from '@mui/material';
import { ProjectTestStatus } from '../../mock/dashboardMock';

interface ProjectTestStatusCardProps {
  data: ProjectTestStatus[];
  onSelectProject: (projectId: string) => void;
}

const ProjectTestStatusCard: React.FC<ProjectTestStatusCardProps> = ({
  data,
  onSelectProject
}) => {
  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Başarı oranına göre renk
  const getPassRateColor = (rate: number): 'success' | 'warning' | 'error' => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'error';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Proje Bazlı Test Durumu
        </Typography>
      </Box>
      
      <List sx={{ overflow: 'auto', flex: 1, maxHeight: 350, p: 0 }}>
        {data.map((project, index) => (
          <React.Fragment key={project.projectId}>
            <ListItem
              alignItems="flex-start"
              sx={{ 
                py: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => onSelectProject(project.projectId)}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="medium">
                      {project.projectName}
                    </Typography>
                    <Chip
                      label={`%${project.passRate.toFixed(1)}`}
                      color={getPassRateColor(project.passRate)}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Toplam: {project.totalTests} test
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Son Çalıştırma: {formatDate(project.lastRun)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.passRate}
                        color={getPassRateColor(project.passRate)}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4, 
                          flexGrow: 1,
                          bgcolor: 'rgba(0, 0, 0, 0.08)'
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="success.main">
                        {project.passedTests} başarılı
                      </Typography>
                      <Typography variant="caption" color="error.main">
                        {project.failedTests} başarısız
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            {index < data.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ProjectTestStatusCard;
