import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { timeAgo } from '../../utils/helpers';

const columns = [
  { id: 'name', label: 'Name', minWidth: 140 },
  { id: 'email', label: 'Email', minWidth: 180 },
  { id: 'role', label: 'Role', width: 100, render: (val) => (
    <Box sx={{ textTransform: 'capitalize', fontWeight: 600, color: '#cbd5e1', fontSize: '0.85rem' }}>{val}</Box>
  )},
  { id: 'college', label: 'College', minWidth: 140 },
  { id: 'status', label: 'Status', width: 100, render: (val) => <StatusBadge status={val} /> },
  { id: 'lastActive', label: 'Last Active', width: 130, render: (val) => (
    <Box sx={{ color: '#64748b', fontSize: '0.8rem' }}>{val ? timeAgo(val) : 'Never'}</Box>
  )},
];

const filters = [
  {
    key: 'role',
    label: 'All Roles',
    options: [
      { value: 'student', label: 'Student' },
      { value: 'faculty', label: 'Faculty' },
      { value: 'driver', label: 'Driver' },
      { value: 'staff', label: 'Staff' },
    ],
  },
  {
    key: 'college',
    label: 'All Colleges',
    options: [
      { value: 'IIT Delhi', label: 'IIT Delhi' },
      { value: 'NIT Warangal', label: 'NIT Warangal' },
      { value: 'BITS Pilani', label: 'BITS Pilani' },
      { value: 'VIT Vellore', label: 'VIT Vellore' },
      { value: 'SRM Chennai', label: 'SRM Chennai' },
    ],
  },
  {
    key: 'status',
    label: 'All Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
];

const UsersPage = () => {
  const { token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="View and monitor all platform users across colleges"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Users' }]}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
           <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search users..."
          filters={filters}
          defaultSortBy="name"
          emptyMessage="No users found in database."
        />
      )}
    </Box>
  );
};

export default UsersPage;
