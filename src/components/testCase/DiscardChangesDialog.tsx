import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

interface DiscardChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

const DiscardChangesDialog: React.FC<DiscardChangesDialogProps> = ({
  open,
  onClose,
  onDiscard,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Discard Changes?</DialogTitle>
      <DialogContent>
        <Typography>
          You have unsaved changes. Are you sure you want to discard them?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDiscard} color="error">Discard</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscardChangesDialog;
