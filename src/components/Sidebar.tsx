import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PlayArrow as PlayArrowIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  HelpOutline as HelpIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDrawer, isMobile } = useApp();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Server Agent', icon: <ComputerIcon />, path: '/server-agent' },
    { text: 'Test Cases', icon: <AssignmentIcon />, path: '/test-cases' },
    { text: 'Test Runs', icon: <PlayArrowIcon />, path: '/test-runs' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Test Execution Simulator', icon: <PlayArrowIcon />, path: '/test-execution-simulator' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      toggleDrawer();
    }
  };

  return (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          TestFlow
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Test Otomasyon Yönetim Aracı
        </Typography>
      </Box>

      <Divider />

      <List component="nav" sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.lighter',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
                borderRadius: 1,
                mx: 1,
                my: 0.5,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => window.open('https://example.com/help', '_blank')}
            sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
          >
            <ListItemIcon>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
