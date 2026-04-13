import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { WarningAmber, DeleteForever, Block, CheckCircle } from '@mui/icons-material';

const iconMap = {
  warning: WarningAmber,
  danger: DeleteForever,
  revoke: Block,
  success: CheckCircle,
};

const colorMap = {
  warning: '#f59e0b',
  danger: '#ef4444',
  revoke: '#ef4444',
  success: '#10b981',
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // warning | danger | revoke | success
  loading = false,
}) => {
  const Icon = iconMap[type] || WarningAmber;
  const color = colorMap[type] || '#f59e0b';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)' },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${color}15`,
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: '#94a3b8' }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{
            background: color,
            '&:hover': { background: color, filter: 'brightness(0.9)' },
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
