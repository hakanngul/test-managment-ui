import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Activity } from '../../mock/dashboardMock';

interface RecentActivitiesCardProps {
  data: Activity[];
  onViewActivity?: (id: string, type: string) => void;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({
  data,
  onViewActivity
}) => {
  // Tarih formatı yardımcı fonksiyonu
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // 1 saatten az
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} dakika önce`;
    }

    // 1 günden az
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} saat önce`;
    }

    // 1 haftadan az
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} gün önce`;
    }

    // Diğer durumlar
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Aktivite tipine göre ikon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_run':
        return <PlayArrowIcon color="primary" />;
      case 'test_updated':
        return <EditIcon color="info" />;
      case 'test_created':
        return <AddCircleOutlineIcon color="success" />;
      case 'user_login':
        return <PersonIcon color="action" />;
      default:
        return <PlayArrowIcon />;
    }
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
          Son Aktiviteler
        </Typography>
      </Box>

      <List sx={{ overflow: 'auto', flex: 1, maxHeight: 350, p: 0 }}>
        {data.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                py: 1.5,
                cursor: activity.relatedId ? 'pointer' : 'default',
                '&:hover': {
                  bgcolor: activity.relatedId ? 'action.hover' : 'transparent'
                }
              }}
              onClick={() => activity.relatedId && onViewActivity && onViewActivity(activity.relatedId, activity.type)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getActivityIcon(activity.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" component="div">
                    {activity.description}
                  </Typography>
                }
                secondary={
                  <Typography component="div" variant="body2">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {activity.user}
                      </Typography>
                      <Chip
                        label={formatDate(activity.timestamp)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
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

export default RecentActivitiesCard;
