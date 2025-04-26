import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { BugReport as BugReportIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <BugReportIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: { xs: '4rem', md: '6rem' } }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
          The page you're looking for doesn't exist or has been moved. Please check the URL or navigate back to the dashboard.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
          color="primary"
          size="large"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;