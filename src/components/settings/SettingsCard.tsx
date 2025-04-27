import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  enabled?: boolean;
  onToggle?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ 
  title, 
  description, 
  icon, 
  enabled, 
  onToggle,
  children,
  actions
}) => {
  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon && <Box sx={{ mr: 1.5 }}>{icon}</Box>}
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {onToggle !== undefined && (
            <Box sx={{ ml: 'auto' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={enabled}
                    onChange={onToggle}
                    color="primary"
                  />
                }
                label={enabled ? "Enabled" : "Disabled"}
                labelPlacement="start"
              />
            </Box>
          )}
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        {children && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>{children}</Box>
          </>
        )}
      </CardContent>
      {actions && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
            {actions}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default SettingsCard;
