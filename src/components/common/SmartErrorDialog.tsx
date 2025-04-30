import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { useErrorDialog } from '../../context/ErrorDialogContext';

const SmartErrorDialog: React.FC = () => {
  const { isOpen, hideError, errorMessage, errorTitle } = useErrorDialog();

  return (
    <Dialog
      open={isOpen}
      onClose={hideError}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="error-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ErrorIcon color="error" />
        <Typography variant="h6" component="span">
          {errorTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {errorMessage.includes('\n') || errorMessage.length > 100 ? (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              maxHeight: '300px',
              overflow: 'auto'
            }}
          >
            <Box component="pre" sx={{ 
              m: 0, 
              fontFamily: 'monospace', 
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {errorMessage}
            </Box>
          </Paper>
        ) : (
          <DialogContentText id="error-dialog-description">
            {errorMessage}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={hideError} color="primary" autoFocus>
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SmartErrorDialog;