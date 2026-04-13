import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute', top: '15%', left: '10%', width: 300, height: 300,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', animation: 'pulse 4s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350,
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', animation: 'pulse 5s ease-in-out infinite reverse',
      }} />

      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          mx: 2,
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(148,163,184,0.1)',
          borderRadius: 4,
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
              }}
            >
              <ShieldIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f1f5f9', mb: 0.5 }}>
              VISCOUS
            </Typography>
            <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600, letterSpacing: '0.15em', fontSize: '0.75rem' }}>
              SUPER ADMIN PANEL
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{
                mb: 2,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                '& .MuiAlert-icon': { color: '#ef4444' },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#64748b', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.4,
                fontSize: '0.9rem',
                fontWeight: 700,
                position: 'relative',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem' }}>
              Demo: admin@viscous.com / admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;
