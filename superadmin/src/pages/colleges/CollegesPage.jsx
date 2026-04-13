import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, IconButton, Tooltip, Stack, CircularProgress } from '@mui/material';
import { Visibility, Edit, Delete, Add } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { formatDate } from '../../utils/helpers';
import CollegeForm from './CollegeForm';

const columns = [
  { id: 'name', label: 'College Name', minWidth: 160 },
  { id: 'code', label: 'Code', width: 80 },
  { id: 'city', label: 'City', minWidth: 100 },
  { id: 'status', label: 'Status', width: 100, render: (val) => <StatusBadge status={val} /> },
  { id: 'plan', label: 'Plan', width: 100, render: (val) => (
    <Box sx={{ color: val === 'Enterprise' ? '#a78bfa' : val === 'Professional' ? '#60a5fa' : '#94a3b8', fontWeight: 600, fontSize: '0.85rem' }}>
      {val}
    </Box>
  )},
  { id: 'buses', label: 'Buses', width: 70, align: 'center' },
  { id: 'controllers', label: 'Controllers', width: 90, align: 'center' },
  { id: 'users', label: 'Users', width: 80, align: 'center' },
  { id: 'createdAt', label: 'Created', width: 110, render: (val) => (
    <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>{formatDate(val)}</Box>
  )},
];

const filters = [
  {
    key: 'status',
    label: 'All Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
  {
    key: 'plan',
    label: 'All Plans',
    options: [
      { value: 'Basic', label: 'Basic' },
      { value: 'Professional', label: 'Professional' },
      { value: 'Enterprise', label: 'Enterprise' },
    ],
  },
];

const CollegesPage = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [colleges, setColleges] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchColleges = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/colleges', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setColleges(data.data);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPlansList(data.data);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchColleges();
      fetchPlans();
    }
  }, [token, fetchColleges, fetchPlans]);

  const handleCreateNew = () => {
    setFormData({ status: 'active', plan: plansList[0]?.name || 'Basic' }); // default values
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEdit = (row) => {
    setFormData({ ...row });
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.code) return; // Add simple validation

    setSubmitting(true);
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/v1/colleges/${formData.id}` 
        : 'http://localhost:5000/api/v1/colleges';
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setFormOpen(false);
        fetchColleges(); // Refresh data
      } else {
        console.error('Failed to save:', data.message);
      }
    } catch (err) {
      console.error('Network Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/colleges/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeleteOpen(false);
        fetchColleges(); // Refresh data
      }
    } catch (err) {
      console.error('Delete error', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Colleges"
        subtitle="Manage all registered colleges and their configurations"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Colleges' }]}
        action="Add College"
        actionIcon={Add}
        onAction={handleCreateNew}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
           <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={colleges}
          searchPlaceholder="Search colleges..."
          filters={filters}
          defaultSortBy="name"
          onRowClick={(row) => navigate(`/colleges/${row.id}`)}
          actions={(row) => (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="View">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/colleges/${row.id}`); }}>
                  <Visibility sx={{ fontSize: 18, color: '#94a3b8' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                  <Edit sx={{ fontSize: 18, color: '#60a5fa' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(row); }}>
                  <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <FormModal
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        title={isEditing ? 'Edit College' : 'Add New College'}
        onSubmit={handleFormSubmit}
        loading={submitting}
        maxWidth="sm"
      >
        <CollegeForm data={formData} onChange={handleFormChange} plansList={plansList} />
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => !submitting && setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete College"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This will remove all associated data.`}
        confirmText={submitting ? "Deleting..." : "Delete"}
        type="danger"
      />
    </Box>
  );
};

export default CollegesPage;
