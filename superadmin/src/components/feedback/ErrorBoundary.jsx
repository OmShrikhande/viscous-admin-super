import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            p: 4,
          }}
        >
          <ErrorOutline sx={{ fontSize: 60, color: '#ef4444', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, color: '#f1f5f9' }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: '#94a3b8', textAlign: 'center', maxWidth: 400 }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
