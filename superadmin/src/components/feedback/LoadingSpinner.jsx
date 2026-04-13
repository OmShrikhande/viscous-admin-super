import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullPage ? '100vh' : 300,
        gap: 2,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={48}
          sx={{
            color: '#6366f1',
          }}
        />
        <CircularProgress
          size={48}
          sx={{
            color: '#8b5cf6',
            position: 'absolute',
            left: 0,
            opacity: 0.3,
          }}
          variant="determinate"
          value={100}
        />
      </Box>
      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
