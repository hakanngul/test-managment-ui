import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { SlowestTest } from '../../mock/dashboardMock';
import { TestCaseCategory } from '../../models/interfaces/ITestCase';

interface SlowestTestsCardProps {
  data: SlowestTest[];
  onViewTest: (id: string) => void;
}

const SlowestTestsCard: React.FC<SlowestTestsCardProps> = ({
  data,
  onViewTest
}) => {
  // Süre formatı yardımcı fonksiyonu
  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) {
      return `${minutes} dk ${seconds % 60} sn`;
    } else {
      return `${seconds} sn`;
    }
  };

  // Kategori adları
  const CATEGORY_NAMES = {
    [TestCaseCategory.FUNCTIONAL]: 'Fonksiyonel',
    [TestCaseCategory.REGRESSION]: 'Regresyon',
    [TestCaseCategory.INTEGRATION]: 'Entegrasyon',
    [TestCaseCategory.PERFORMANCE]: 'Performans',
    [TestCaseCategory.SECURITY]: 'Güvenlik',
    [TestCaseCategory.USABILITY]: 'Kullanılabilirlik',
    [TestCaseCategory.ACCEPTANCE]: 'Kabul',
    [TestCaseCategory.SMOKE]: 'Smoke',
    [TestCaseCategory.EXPLORATORY]: 'Keşif'
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
          En Yavaş Testler
        </Typography>
      </Box>

      <List sx={{ overflow: 'auto', flex: 1, maxHeight: 350, p: 0 }}>
        {data.map((test, index) => (
          <React.Fragment key={test.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                py: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => onViewTest(test.id)}
            >
              <ListItemText
                primary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="medium" component="span">
                        {test.name}
                      </Typography>
                      <Chip
                        label={formatDuration(test.averageDuration)}
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </Box>
                  </Typography>
                }
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" component="span">
                        Kategori: {CATEGORY_NAMES[test.category]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span">
                        Son Çalıştırma: {new Intl.DateTimeFormat('tr-TR').format(test.lastRun)}
                      </Typography>
                    </Box>
                  </Typography>
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

export default SlowestTestsCard;
