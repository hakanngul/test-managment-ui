import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import {
  Security as SecurityIcon,
  VpnKey as ApiKeyIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import SettingsSection from './SettingsSection';
import SettingsCard from './SettingsCard';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  expiresAt: string | null;
  scopes: string[];
  lastUsed: string | null;
}

const defaultApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Development API Key',
    key: 'dev_api_key_12345',
    createdAt: '2023-01-15T10:30:00Z',
    expiresAt: '2024-01-15T10:30:00Z',
    scopes: ['read', 'write'],
    lastUsed: '2023-05-20T14:45:00Z'
  },
  {
    id: '2',
    name: 'CI/CD Pipeline',
    key: 'cicd_api_key_67890',
    createdAt: '2023-02-10T08:15:00Z',
    expiresAt: null,
    scopes: ['read', 'write', 'execute'],
    lastUsed: '2023-05-25T09:30:00Z'
  },
  {
    id: '3',
    name: 'Read-only Access',
    key: 'readonly_api_key_abcde',
    createdAt: '2023-03-05T16:45:00Z',
    expiresAt: '2023-09-05T16:45:00Z',
    scopes: ['read'],
    lastUsed: null
  }
];

const availableScopes = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'execute', label: 'Execute' },
  { value: 'admin', label: 'Admin' }
];

const SecuritySettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(defaultApiKeys);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['read']);
  const [newKeyExpiration, setNewKeyExpiration] = useState<string>('never');
  const [customExpiration, setCustomExpiration] = useState<string>('');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const handleAddKey = () => {
    setNewKeyName('');
    setNewKeyScopes(['read']);
    setNewKeyExpiration('never');
    setCustomExpiration('');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCreateKey = () => {
    if (!newKeyName) {
      setSnackbarMessage('API Key name is required');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Generate a random API key
    const newKey = `api_key_${Math.random().toString(36).substring(2, 15)}`;
    
    // Calculate expiration date if not "never"
    let expiresAt: string | null = null;
    if (newKeyExpiration !== 'never') {
      const now = new Date();
      if (newKeyExpiration === 'custom' && customExpiration) {
        expiresAt = new Date(customExpiration).toISOString();
      } else if (newKeyExpiration === '30days') {
        now.setDate(now.getDate() + 30);
        expiresAt = now.toISOString();
      } else if (newKeyExpiration === '90days') {
        now.setDate(now.getDate() + 90);
        expiresAt = now.toISOString();
      } else if (newKeyExpiration === '1year') {
        now.setFullYear(now.getFullYear() + 1);
        expiresAt = now.toISOString();
      }
    }

    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKey,
      createdAt: new Date().toISOString(),
      expiresAt,
      scopes: newKeyScopes,
      lastUsed: null
    };

    setApiKeys([...apiKeys, newApiKey]);
    setNewlyCreatedKey(newKey);
    setShowKeys({ ...showKeys, [newApiKey.id]: true });
    setSnackbarMessage('API Key created successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    setSnackbarMessage('API Key deleted successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleToggleKeyVisibility = (id: string) => {
    setShowKeys({
      ...showKeys,
      [id]: !showKeys[id]
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSnackbarMessage('API Key copied to clipboard');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleRegenerateKey = (id: string) => {
    const newKey = `api_key_${Math.random().toString(36).substring(2, 15)}`;
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, key: newKey } : key
    ));
    setShowKeys({ ...showKeys, [id]: true });
    setSnackbarMessage('API Key regenerated successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleScopeChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setNewKeyScopes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleExpirationChange = (event: SelectChangeEvent<string>) => {
    setNewKeyExpiration(event.target.value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SettingsSection
      title="Security Settings"
      description="Manage API keys and access control for your test automation platform."
    >
      <SettingsCard
        title="API Keys"
        icon={<ApiKeyIcon />}
        description="Create and manage API keys for accessing the test automation API"
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddKey}
          >
            Create API Key
          </Button>
        }
      >
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>API Key</TableCell>
                <TableCell>Scopes</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••'}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {apiKey.scopes.map(scope => (
                        <Chip
                          key={scope}
                          label={scope}
                          size="small"
                          color={
                            scope === 'admin' ? 'error' :
                            scope === 'write' || scope === 'execute' ? 'warning' : 'info'
                          }
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.createdAt)}</TableCell>
                  <TableCell>{formatDate(apiKey.expiresAt)}</TableCell>
                  <TableCell>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Regenerate Key">
                      <IconButton
                        size="small"
                        onClick={() => handleRegenerateKey(apiKey.id)}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Key">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No API keys found. Create your first API key to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </SettingsCard>

      {/* Create API Key Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Key Name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                margin="normal"
                required
                placeholder="e.g. Development API Key"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="scopes-label">Scopes</InputLabel>
                <Select
                  labelId="scopes-label"
                  multiple
                  value={newKeyScopes}
                  onChange={handleScopeChange}
                  label="Scopes"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableScopes.map((scope) => (
                    <MenuItem key={scope.value} value={scope.value}>
                      {scope.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="expiration-label">Expiration</InputLabel>
                <Select
                  labelId="expiration-label"
                  value={newKeyExpiration}
                  onChange={handleExpirationChange}
                  label="Expiration"
                >
                  <MenuItem value="never">Never</MenuItem>
                  <MenuItem value="30days">30 Days</MenuItem>
                  <MenuItem value="90days">90 Days</MenuItem>
                  <MenuItem value="1year">1 Year</MenuItem>
                  <MenuItem value="custom">Custom Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newKeyExpiration === 'custom' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Expiration Date"
                  type="date"
                  value={customExpiration}
                  onChange={(e) => setCustomExpiration(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateKey} variant="contained" color="primary">
            Create API Key
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

export default SecuritySettings;
