import React from 'react';
import { Menu, Box, Typography, Chip } from '@mui/material';

interface FilterMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  selectedStatusFilter: string;
  selectedPriorityFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPriorityFilterChange: (priority: string) => void;
  getStatusColor: (status: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
  getPriorityColor: (priority: string) => "success" | "warning" | "default" | "primary" | "secondary" | "error" | "info";
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  anchorEl,
  open,
  onClose,
  selectedStatusFilter,
  selectedPriorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  getStatusColor,
  getPriorityColor
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Status
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {['all', 'active', 'draft', 'archived'].map((status) => (
            <Chip
              key={status}
              label={status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              onClick={() => onStatusFilterChange(status)}
              variant={selectedStatusFilter === status ? 'filled' : 'outlined'}
              color={selectedStatusFilter === status ? (status === 'all' ? 'primary' : getStatusColor(status)) : 'default'}
            />
          ))}
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Priority
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['all', 'critical', 'high', 'medium', 'low'].map((priority) => (
            <Chip
              key={priority}
              label={priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              onClick={() => onPriorityFilterChange(priority)}
              variant={selectedPriorityFilter === priority ? 'filled' : 'outlined'}
              color={selectedPriorityFilter === priority ? (priority === 'all' ? 'primary' : getPriorityColor(priority)) : 'default'}
            />
          ))}
        </Box>
      </Box>
    </Menu>
  );
};

export default FilterMenu;
