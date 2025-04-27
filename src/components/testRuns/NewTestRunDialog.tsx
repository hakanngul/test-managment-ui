import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Stack,
  TextField,
  Button,
} from '@mui/material';

interface NewTestRunData {
  name: string;
  startDate: string;
  endDate: string;
  assignee: string;
}

interface NewTestRunDialogProps {
  open: boolean;
  data: NewTestRunData;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  onSubmit: () => void;
}

const NewTestRunDialog: React.FC<NewTestRunDialogProps> = ({
  open,
  data,
  onClose,
  onChange,
  onSubmit,
}) => {
  const isFormValid = data.name && data.startDate && data.endDate && data.assignee;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Create New Test Run</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Test Run Name"
              fullWidth
              required
              value={data.name}
              onChange={onChange}
            />

            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              fullWidth
              required
              value={data.startDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="endDate"
              label="End Date"
              type="date"
              fullWidth
              required
              value={data.endDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="assignee"
              label="Assignee"
              fullWidth
              required
              value={data.assignee}
              onChange={onChange}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTestRunDialog;
