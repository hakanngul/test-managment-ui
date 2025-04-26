import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ open, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  const formatNotificationDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    // In a real app, you might navigate to relevant page or open a modal
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 0,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications</Typography>
        </Box>
      ) : (
        <>
          <List sx={{ overflow: 'auto', flexGrow: 1 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Chip
                        label={notification.type.toUpperCase()}
                        size="small"
                        color={getNotificationColor(notification.type)}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatNotificationDate(notification.createdAt)}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={notification.message}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: notification.read ? 'normal' : 'medium',
                      }}
                    />
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
          
          <Box sx={{ p: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={clearAllNotifications}
            >
              Clear All Notifications
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default NotificationsPanel;