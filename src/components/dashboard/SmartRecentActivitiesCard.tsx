import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useRecentActivitiesData } from '../../hooks/cardsHooks/useRecentActivitiesData';

const SmartRecentActivitiesCard: React.FC = () => {
  const navigate = useNavigate();
  const { activities, isLoading, error, refresh } = useRecentActivitiesData();

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

  // Aktivite detaylarını görüntüleme
  const handleViewActivity = (id: string, type: string) => {
    if (type.startsWith('test_')) {
      navigate(`/test-cases/${id}`);
    }
  };

  if (isLoading && activities.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography color="error" gutterBottom>
          Veri yüklenirken hata oluştu: {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={refresh}
        >
          Yeniden Dene
        </Button>
      </Paper>
    );
  }

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
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Son Aktiviteler
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoading && (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          )}
          <Tooltip title="Yenile">
            <IconButton size="small" onClick={refresh}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <List sx={{ overflow: 'auto', flex: 1, maxHeight: 350, p: 0 }}>
        {activities.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Henüz aktivite bulunmuyor.
            </Typography>
          </Box>
        ) : (
          activities.map((activity, index) => (
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
                onClick={() => activity.relatedId && handleViewActivity(activity.relatedId, activity.type)}
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
              {index < activities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        )}
      </List>
    </Paper>
  );
};

export default SmartRecentActivitiesCard;