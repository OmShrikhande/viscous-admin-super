import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Grid, Card, CardContent, Typography, Tabs, Tab, Chip, Button,
  IconButton, Tooltip, Stack, Avatar, CircularProgress
} from '@mui/material';
import {
  Add, Edit, Delete, Download, Receipt, CalendarMonth, Warning,
  CheckCircle, Schedule, Cancel,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatsCard from '../../components/common/StatsCard';
import StatusBadge from '../../components/common/StatusBadge';
import FormModal from '../../components/common/FormModal';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/helpers';
import PlanForm from './PlanForm';

const planColumns = [
  { id: 'name', label: 'Plan Name', render: (val) => (
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#e2e8f0' }}>{val}</Typography>
  )},
  { id: 'price', label: 'Price (₹)', render: (val) => (
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(val)}</Typography>
  )},
  { id: 'maxBuses', label: 'Max Buses', align: 'center' },
  { id: 'maxUsers', label: 'Max Users', align: 'center' },
  { id: 'maxControllers', label: 'Max Controllers', align: 'center' },
  { id: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
];

const invoiceColumns = [
  { id: 'id', label: 'Invoice ID', render: (val) => (
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>{val}</Typography>
  )},
  { id: 'college', label: 'College' },
  { id: 'amount', label: 'Amount', render: (val) => (
    <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>{formatCurrency(val)}</Typography>
  )},
  { id: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
  { id: 'issuedDate', label: 'Issued', render: (val) => (
    <Box sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>{formatDate(val)}</Box>
  )},
];

const BillingPage = () => {
  const { token } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(0);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, invoicesRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/plans', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/v1/invoices', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const plansData = await plansRes.json();
      const invoicesData = await invoicesRes.json();

      if (plansData.success) setPlans(plansData.data);
      if (invoicesData.success) setInvoices(invoicesData.data);
    } catch (err) {
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleCreatePlan = () => {
    setFormData({ duration: 30, status: 'active', features: [] });
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEditPlan = (row) => {
    setFormData({ ...row });
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeletePlan = (row) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name || formData.price === undefined) return;

    setSubmitting(true);
    try {
      const url = isEditing
        ? `http://localhost:5000/api/v1/plans/${formData.id}`
        : 'http://localhost:5000/api/v1/plans';

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
        fetchData();
      }
    } catch (err) {
      console.error('Save Plan Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/plans/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDeleteOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Delete Plan error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeInvoicesCount = invoices.filter((i) => i.status === 'active' || i.status === 'paid').length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'pending').length;
  const totalRevenue = invoices.filter((i) => i.status === 'active' || i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box>
      <PageHeader
        title="Billing"
        subtitle="Manage subscription plans, invoices, and billing history"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Billing' }]}
      />

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatsCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={Receipt} color="#10b981" trend="up" trendValue="+15.4%" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatsCard title="Paid Invoices" value={activeInvoicesCount} icon={CheckCircle} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatsCard title="Pending Payments" value={pendingInvoicesCount} icon={Schedule} color="#f59e0b" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: '1px solid rgba(148,163,184,0.08)',
            px: 2,
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', color: '#94a3b8' },
            '& .Mui-selected': { color: '#818cf8' },
            '& .MuiTabs-indicator': { background: '#6366f1' },
          }}
        >
          <Tab label="Subscription Plans" />
          <Tab label="Invoices" />
          <Tab label="Billing History" />
        </Tabs>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<Add />} onClick={handleCreatePlan}>
                  Create Plan
                </Button>
              </Box>
              <DataTable
                columns={planColumns}
                data={plans}
                searchPlaceholder="Search plans..."
                actions={(row) => (
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditPlan(row)}>
                        <Edit sx={{ fontSize: 18, color: '#60a5fa' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDeletePlan(row)}>
                        <Delete sx={{ fontSize: 18, color: '#ef4444' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              />
            </Box>
          )}

          {tab === 1 && (
            <DataTable
              columns={invoiceColumns}
              data={invoices.filter(i => i.status === 'pending')}
              searchPlaceholder="Search pending invoices..."
            />
          )}

          {tab === 2 && (
            <DataTable
              columns={invoiceColumns}
              data={invoices}
              searchPlaceholder="Search history..."
              actions={(row) => (
                <Tooltip title="Download">
                  <IconButton size="small">
                    <Download sx={{ fontSize: 18, color: '#94a3b8' }} />
                  </IconButton>
                </Tooltip>
              )}
            />
          )}
        </>
      )}

      {/* Plan Form Modal */}
      <FormModal
        open={formOpen}
        onClose={() => !submitting && setFormOpen(false)}
        title={isEditing ? 'Edit Plan' : 'Create Subscription Plan'}
        onSubmit={handleFormSubmit}
        loading={submitting}
        maxWidth="sm"
      >
        <PlanForm data={formData} onChange={(k, v) => setFormData(p => ({...p, [k]: v}))} />
      </FormModal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => !submitting && setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={submitting}
        title="Delete Plan"
        message={`permanently delete ${deleteTarget?.name}?`}
        confirmText="Delete"
        type="danger"
      />
    </Box>
  );
};

export default BillingPage;
