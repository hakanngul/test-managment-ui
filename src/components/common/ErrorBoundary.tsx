import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            m: 2,
            borderRadius: 2,
            border: '1px solid #f44336',
            bgcolor: 'rgba(244, 67, 54, 0.08)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6" color="error">
              Bir hata oluştu
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            Bu bileşen yüklenirken beklenmeyen bir hata oluştu.
          </Typography>
          
          {this.state.error && (
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                maxHeight: '200px',
                overflow: 'auto'
              }}
            >
              <Box component="pre" sx={{ 
                m: 0, 
                fontFamily: 'monospace', 
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
              </Box>
            </Paper>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            Yeniden Dene
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;