import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface Environment {
  id: string;
  name: string;
  baseUrl: string;
  description: string;
  variables: { key: string; value: string }[];
}

const defaultEnvironments: Environment[] = [
  {
    id: '1',
    name: 'Development',
    baseUrl: 'https://dev-api.example.com',
    description: 'Development environment for testing new features',
    variables: [
      { key: 'API_KEY', value: 'dev-api-key-123' },
      { key: 'TIMEOUT', value: '30000' }
    ]
  },
  {
    id: '2',
    name: 'QA',
    baseUrl: 'https://qa-api.example.com',
    description: 'QA environment for testing before staging',
    variables: [
      { key: 'API_KEY', value: 'qa-api-key-456' },
      { key: 'TIMEOUT', value: '20000' }
    ]
  },
  {
    id: '3',
    name: 'Staging',
    baseUrl: 'https://staging-api.example.com',
    description: 'Staging environment for pre-production testing',
    variables: [
      { key: 'API_KEY', value: 'staging-api-key-789' },
      { key: 'TIMEOUT', value: '15000' }
    ]
  },
  {
    id: '4',
    name: 'Production',
    baseUrl: 'https://api.example.com',
    description: 'Production environment',
    variables: [
      { key: 'API_KEY', value: 'prod-api-key-xyz' },
      { key: 'TIMEOUT', value: '10000' }
    ]
  }
];

const TestEnvironmentSettings: React.FC = () => {
  const [environments, setEnvironments] = useState<Environment[]>(defaultEnvironments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleAddEnvironment = () => {
    setCurrentEnvironment({
      id: '',
      name: '',
      baseUrl: '',
      description: '',
      variables: []
    });
    setDialogOpen(true);
  };

  const handleEditEnvironment = (env: Environment) => {
    setCurrentEnvironment({ ...env });
    setDialogOpen(true);
  };

  const handleDeleteEnvironment = (id: string) => {
    setEnvironments(environments.filter(env => env.id !== id));
    setSnackbarMessage('Environment deleted successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentEnvironment(null);
  };

  const handleSaveEnvironment = () => {
    if (!currentEnvironment) return;

    if (!currentEnvironment.name || !currentEnvironment.baseUrl) {
      setSnackbarMessage('Name and Base URL are required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (currentEnvironment.id) {
      // Edit existing environment
      setEnvironments(
        environments.map(env =>
          env.id === currentEnvironment.id ? currentEnvironment : env
        )
      );
      setSnackbarMessage('Environment updated successfully');
    } else {
      // Add new environment
      const newEnvironment = {
        ...currentEnvironment,
        id: Date.now().toString()
      };
      setEnvironments([...environments, newEnvironment]);
      setSnackbarMessage('Environment added successfully');
    }

    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    handleDialogClose();
  };

  const handleEnvironmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentEnvironment) return;

    const { name, value } = e.target;
    setCurrentEnvironment({
      ...currentEnvironment,
      [name]: value
    });
  };

  const handleAddVariable = () => {
    if (!currentEnvironment) return;

    setCurrentEnvironment({
      ...currentEnvironment,
      variables: [...currentEnvironment.variables, { key: '', value: '' }]
    });
  };

  const handleVariableChange = (index: number, field: 'key' | 'value', value: string) => {
    if (!currentEnvironment) return;

    const newVariables = [...currentEnvironment.variables];
    newVariables[index][field] = value;

    setCurrentEnvironment({
      ...currentEnvironment,
      variables: newVariables
    });
  };

  const handleRemoveVariable = (index: number) => {
    if (!currentEnvironment) return;

    const newVariables = [...currentEnvironment.variables];
    newVariables.splice(index, 1);

    setCurrentEnvironment({
      ...currentEnvironment,
      variables: newVariables
    });
  };

  return (
    <SettingsSection
      title="Test Environments"
      description="Configure different environments for running your tests."
    >
      <SettingsCard
        title="Environments"
        icon={<PublicIcon />}
        description="Define and manage test environments"
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddEnvironment}
          >
            Add Environment
          </Button>
        }
      >
        <List>
          {environments.map((env, index) => (
            <React.Fragment key={env.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={env.name}
                  secondary={
                    <>
                      <Box component="span" sx={{ display: 'block' }}>
                        {env.baseUrl}
                      </Box>
                      <Box component="span" sx={{ display: 'block' }}>
                        {env.description}
                      </Box>
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        {env.variables.length} environment variables
                      </Box>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit">
                    <IconButton edge="end" onClick={() => handleEditEnvironment(env)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton edge="end" onClick={() => handleDeleteEnvironment(env.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </SettingsCard>

      {/* Environment Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentEnvironment?.id ? 'Edit Environment' : 'Add Environment'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Environment Name"
                name="name"
                value={currentEnvironment?.name || ''}
                onChange={handleEnvironmentChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Base URL"
                name="baseUrl"
                value={currentEnvironment?.baseUrl || ''}
                onChange={handleEnvironmentChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={currentEnvironment?.description || ''}
                onChange={handleEnvironmentChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">Environment Variables</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddVariable}
                  size="small"
                >
                  Add Variable
                </Button>
              </Box>
              {currentEnvironment?.variables.map((variable, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    label="Key"
                    value={variable.key}
                    onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                  />
                  <TextField
                    label="Value"
                    value={variable.value}
                    onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                    sx={{ mr: 2, flex: 1 }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveVariable(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEnvironment} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SettingsSection>
  );
};

export default TestEnvironmentSettings;
