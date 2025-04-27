import React from 'react';
import { Menu, MenuItem } from '@mui/material';

interface SortMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (sortField: string) => void;
}

const SortMenu: React.FC<SortMenuProps> = ({
  anchorEl,
  open,
  onClose,
  sortBy,
  sortDirection,
  onSortChange
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={() => onSortChange('title')}>
        Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
      </MenuItem>
      <MenuItem onClick={() => onSortChange('priority')}>
        Priority {sortBy === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
      </MenuItem>
      <MenuItem onClick={() => onSortChange('status')}>
        Status {sortBy === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
      </MenuItem>
      <MenuItem onClick={() => onSortChange('updatedAt')}>
        Last Updated {sortBy === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
      </MenuItem>
    </Menu>
  );
};

export default SortMenu;
