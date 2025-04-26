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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PlayArrow as PlayArrowIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
  Computer as ComputerIcon,
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, currentProject, setCurrentProject, toggleDrawer, isMobile } = useApp();

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const projectId = event.target.value;
    const selectedProject = projects.find(p => p.id === projectId) || null;
    setCurrentProject(selectedProject);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Test Cases', icon: <AssignmentIcon />, path: '/test-cases' },
    { text: 'Test Runs', icon: <PlayArrowIcon />, path: '/test-runs' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Server Agent', icon: <ComputerIcon />, path: '/server-agent' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
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
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          PROJECT
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="project-select-label">Select Project</InputLabel>
          <Select
            labelId="project-select-label"
            id="project-select"
            value={currentProject?.id || ''}
            label="Select Project"
            onChange={handleProjectChange}
          >
            {projects.map((project: Project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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