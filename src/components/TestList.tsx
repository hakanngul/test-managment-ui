import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, LinearProgress, Chip } from '@mui/material';
import { Test } from '../services/websocket/types';

interface TestListProps {
  tests: Record<string, Test>;
  selectedTestId: string | null;
  onSelectTest: (testId: string) => void;
}

/**
 * Aktif testlerin listesi
 */
const TestList: React.FC<TestListProps> = ({ tests, selectedTestId, onSelectTest }) => {
  // Test durumu metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor';
      case 'completed': return 'Tamamlandı';
      case 'failed': return 'Başarısız';
      case 'aborted': return 'İptal Edildi';
      case 'pending': return 'Bekliyor';
      default: return status;
    }
  };
  
  // Test durumu rengi
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'aborted': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6">
          Aktif Testler
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 400px)' }}>
        {Object.values(tests).length > 0 ? (
          Object.values(tests).map(test => (
            <ListItem
              key={test.id}
              button
              selected={selectedTestId === test.id}
              onClick={() => onSelectTest(test.id)}
              sx={{
                borderLeft: `4px solid ${
                  test.status === 'running' ? '#2196f3' :
                  test.status === 'completed' ? '#4caf50' :
                  test.status === 'failed' ? '#f44336' :
                  test.status === 'aborted' ? '#ff9800' : '#9e9e9e'
                }`,
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.12)',
                  },
                },
              }}
            >
              <ListItemText
                primary={test.name}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Chip
                        label={getStatusText(test.status)}
                        color={getStatusColor(test.status) as any}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        ID: {test.id.substring(0, 8)}
                      </Typography>
                    </Box>
                    
                    {test.currentStep > 0 && test.totalSteps > 0 && (
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            İlerleme
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {test.currentStep}/{test.totalSteps}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(test.currentStep / test.totalSteps) * 100}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Başlangıç: {new Date(test.startTime).toLocaleTimeString()}
                      </Typography>
                      {test.endTime && (
                        <Typography variant="caption" color="text.secondary">
                          Bitiş: {new Date(test.endTime).toLocaleTimeString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="Aktif test yok"
              secondary="Test çalıştırdığınızda burada görünecektir"
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default TestList;
