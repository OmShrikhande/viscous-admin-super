import React from 'react';
import { Chip } from '@mui/material';

const statusConfig = {
  active: { label: 'Active', color: 'success' },
  inactive: { label: 'Inactive', color: 'default' },
  suspended: { label: 'Suspended', color: 'warning' },
  revoked: { label: 'Revoked', color: 'error' },
  pending: { label: 'Pending', color: 'info' },
  expired: { label: 'Expired', color: 'error' },
};

const StatusBadge = ({ status, size = 'small', variant = 'filled' }) => {
  const config = statusConfig[status?.toLowerCase()] || { label: status, color: 'default' };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 700,
        fontSize: '0.7rem',
        borderRadius: '8px',
        height: size === 'small' ? 24 : 28,
        ...(variant === 'filled' && {
          '&.MuiChip-colorSuccess': { background: 'rgba(16,185,129,0.15)', color: '#34d399' },
          '&.MuiChip-colorError': { background: 'rgba(239,68,68,0.15)', color: '#f87171' },
          '&.MuiChip-colorWarning': { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
          '&.MuiChip-colorInfo': { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
          '&.MuiChip-colorDefault': { background: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
        }),
      }}
    />
  );
};

export default StatusBadge;
