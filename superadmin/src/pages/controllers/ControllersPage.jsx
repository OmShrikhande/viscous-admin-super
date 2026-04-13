import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import {
  Add, Edit, Visibility, MoreVert,
  Block, CheckCircle, DeleteForever, LockReset
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { getInitials, stringToColor } from '../../utils/helpers';
import AdminForm from './AdminForm';

// Component structure matches the old logic, merely adjusting dynamic mapping props.

const ControllersPage = () => {
  const { token } = useSelector((state) => state.auth);

  const [admins, setAdmins] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Actions Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({});

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/admins', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchColleges = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/colleges', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCollegesList(data.data);
      }
    } catch (err) {
      console.error('Error fetching colleges list:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchAdmins();
      fetchColleges();
    }
  }, [token, fetchAdmins, fetchColleges]);

  const handleActionClick = (e, row) => {
    setAnchorEl(e.currentTarget);
    setSelectedRow(row);
  };
  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleCreate = () => {
    setFormData({ role: 'admin', college: 'Unassigned', permissions: [] });
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEdit = () => {
    setFormData({ ...selectedRow });
    setIsEditing(true);
    setFormOpen(true);
    handleActionClose();
  };

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.email) return;
    if (!isEditing && formData.password !== formData.confirmPassword) {
      setToast({ open: true, message: "Passwords don't match", severity: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const url = isEditing
        ? `http://localhost:5000/api/v1/admins/${formData.id}`
        : 'http://localhost:5000/api/v1/admins';
      
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setFormOpen(false);
        fetchAdmins();
        setToast({ open: true, message: isEditing ? 'Admin updated successfully' : 'Admin created successfully', severity: 'success' });
      } else {
        setToast({ open: true, message: data.message || 'Action failed', severity: 'error' });
      }
    } catch (err) {
      console.error('Network Error:', err);
      setToast({ open: true, message: 'Network error occurred', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const openConfirm = (title, message, confirmText, type, actionFn) => {
    setConfirmConfig({ title, message, confirmText, type, onConfirm: actionFn });
    setConfirmOpen(true);
    handleActionClose();
  };

  const executeStatusPatch = async (action) => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admins/${selectedRow.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        setConfirmOpen(false);
        fetchAdmins();
        setToast({ open: true, message: data.message || 'Action completed successfully', severity: 'success' });
      } else {
         setToast({ open: true, message: data.message || 'Action failed', severity: 'error' });
      }
    } catch (err) {
      console.error('Action error', err);
      setToast({ open: true, message: 'Network error occurred', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const executeDelete = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admins/${selectedRow.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setConfirmOpen(false);
        fetchAdmins();
        setToast({ open: true, message: 'Account permanently deleted', severity: 'success' });
      }
    } catch (err) {
      console.error('Delete error:', err);
      setToast({ open: true, message: 'Delete error occurred', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { id: 'name', label: 'Name', width: 160 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'role', label: 'Role', width: 120 },
    { id: 'college', label: 'College', width: 160 },
    { id: 'status', label: 'Status', width: 110, render: (val) => <StatusBadge status={val} /> },
  ];

  return (
    <Box>
      <PageHeader
        title="Admin & Controllers"
        subtitle="Manage platform access, roles, and college-level controllers"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Controllers' }]}
        action="Add Controller"
        onAction={handleCreate}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          searchPlaceholder="Search admins by name or email..."
          actions={(row) => (
            <IconButton size="small" onClick={(e) => handleActionClick(e, row)}>
              <MoreVert sx={{ fontSize: 18, color: '#94a3b8' }} />
            </IconButton>
          )}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        PaperProps={{
          sx: { background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)', color: '#e2e8f0', minWidth: 160 }
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><Edit sx={{ color: '#60a5fa', fontSize: 18 }} /></ListItemIcon>
          <ListItemText primary="Edit Profile" primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </MenuItem>
        
        {selectedRow?.status !== 'active' ? (
          <MenuItem onClick={() => openConfirm('Activate Account', `Are you sure you want to restore access for ${selectedRow.name}?`, 'Activate', 'success', () => executeStatusPatch('activate'))}>
            <ListItemIcon><CheckCircle sx={{ color: '#10b981', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Activate" primaryTypographyProps={{ fontSize: '0.85rem' }} />
          </MenuItem>
        ) : (
          <MenuItem onClick={() => openConfirm('Suspend Account', `Temporarily block access for ${selectedRow.name}?`, 'Suspend', 'warning', () => executeStatusPatch('deactivate'))}>
             <ListItemIcon><Block sx={{ color: '#f59e0b', fontSize: 18 }} /></ListItemIcon>
             <ListItemText primary="Suspend" primaryTypographyProps={{ fontSize: '0.85rem' }} />
          </MenuItem>
        )}

        {selectedRow?.status !== 'revoked' && (
          <MenuItem onClick={() => openConfirm('Revoke Access', `Instantly terminate all active sessions for ${selectedRow.name}?`, 'Revoke Now', 'danger', () => executeStatusPatch('revoke'))}>
             <ListItemIcon><LockReset sx={{ color: '#ef4444', fontSize: 18 }} /></ListItemIcon>
             <ListItemText primary="Force Logout" primaryTypographyProps={{ fontSize: '0.85rem' }} />
          </MenuItem>
        )}

        <MenuItem onClick={() => openConfirm('Delete Account', `Permanently delete ${selectedRow.name}? This action cannot be reversed.`, 'Delete Forever', 'danger', executeDelete)}>
           <ListItemIcon><DeleteForever sx={{ color: '#ef4444', fontSize: 18 }} /></ListItemIcon>
           <ListItemText primary="Delete Forever" primaryTypographyProps={{ fontSize: '0.85rem' }} />
        </MenuItem>
      </Menu>

      {/* Form Modal */}
      <FormModal
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        title={isEditing ? 'Edit Administrator' : 'Create Administrator'}
        onSubmit={handleFormSubmit}
        loading={submitting}
        maxWidth="md"
      >
        <AdminForm data={formData} onChange={handleFormChange} collegesList={collegesList} />
      </FormModal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => !submitting && setConfirmOpen(false)}
        {...confirmConfig}
        confirmText={submitting ? "Processing..." : confirmConfig.confirmText}
      />

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ControllersPage;
