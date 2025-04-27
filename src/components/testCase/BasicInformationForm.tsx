import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import { TestCase } from '../../types';

interface BasicInformationFormProps {
  formData: Partial<TestCase>;
  errors: Record<string, string>;
  availableTags: string[];
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => void;
  onTagsChange: (event: React.SyntheticEvent, newValue: string[]) => void;
}

const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  formData,
  errors,
  availableTags,
  loading,
  onChange,
  onTagsChange,
}) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Basic Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Test Case Title"
              fullWidth
              required
              value={formData.title}
              onChange={onChange}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={onChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                name="priority"
                value={formData.priority || 'medium'}
                label="Priority"
                onChange={onChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formData.status || 'draft'}
                label="Status"
                onChange={onChange}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="tags"
              options={availableTags}
              value={formData.tags || []}
              onChange={onTagsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                ))
              }
              loading={loading}
              loadingText="Loading tags..."
              noOptionsText="No tags available"
              freeSolo
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BasicInformationForm;
