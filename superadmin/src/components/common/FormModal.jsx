import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const FormModal = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Save',
  cancelText = 'Cancel',
  maxWidth = 'sm',
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          background: '#1e293b',
          border: '1px solid rgba(148,163,184,0.1)',
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#94a3b8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'rgba(148,163,184,0.08)', py: 3 }}>
        {children}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} sx={{ color: '#94a3b8' }}>
          {cancelText}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? 'Saving...' : submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
