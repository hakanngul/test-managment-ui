import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import NotificationsPanel from './NotificationsPanel';

const drawerWidth = 260;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDrawerOpen, toggleDrawer, notifications, isMobile } = useApp();
  
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const toggleNotificationsPanel = () => {
    setNotificationsPanelOpen(!notificationsPanelOpen);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            TestFlow
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton 
                color="inherit" 
                onClick={toggleNotificationsPanel}
                sx={{ ml: 1 }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar 
                  sx={{ width: 32, height: 32 }}
                  src={user?.avatar}
                  alt={user?.name}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Sidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          overflow: 'auto',
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            minWidth: 180,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </Box>
  );
};

export default Layout;