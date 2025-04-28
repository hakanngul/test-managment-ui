import React from 'react';
import { Box, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { TestCase } from '../../types';

interface TestCaseDetailHeaderProps {
  testCase: TestCase;
  editMode: boolean;
  onEditToggle: () => void;
  onDeleteTestCase: () => void;
  onRunTest: () => void;
}

const TestCaseDetailHeader: React.FC<TestCaseDetailHeaderProps> = ({
  testCase,
  editMode,
  onEditToggle,
  onDeleteTestCase,
  onRunTest
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/test-cases');
          }}
        >
          Test Cases
        </Link>
        <Typography color="text.primary">{testCase.title}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="500">
          {testCase.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteTestCase}
          >
            Delete
          </Button>
          <Button
            variant={editMode ? "contained" : "outlined"}
            color={editMode ? "primary" : "inherit"}
            startIcon={<EditIcon />}
            onClick={onEditToggle}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayIcon />}
            onClick={onRunTest}
          >
            Run Test
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TestCaseDetailHeader;
