import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  Container,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  BugReport as BugReportIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <BugReportIcon
            color="primary"
            sx={{ fontSize: 40, mr: 1 }}
          />
          <Typography component="h1" variant="h4" fontWeight="bold">
            TestFlow
          </Typography>
        </Box>
        
        <Typography component="h1" variant="h5" gutterBottom>
          Sign in
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter your credentials to access your account
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: 4,
            width: '100%',
            mt: 2,
            borderRadius: 2,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link href="#" underline="hover" variant="body2">
                Forgot password?
              </Link>
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link href="#" underline="hover" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;