import React from 'react';
import { TextField, Grid, MenuItem, FormGroup, FormControlLabel, Checkbox, Typography, Box } from '@mui/material';

const permissions = [
  { key: 'view_analytics', label: 'Analytics' },
  { key: 'view_livestream', label: 'Live Stream' },
  { key: 'manage_buses', label: 'Fleet Management' },
  { key: 'manage_routes', label: 'Manage Routes' },
  { key: 'manage_drivers', label: 'Add Driver' },
  { key: 'manage_users', label: 'Users & Students' },
  { key: 'manage_notifications', label: 'Notifications' },
  { key: 'manage_settings', label: 'Manage Settings' },
];

const AdminForm = ({ data, onChange, collegesList = [] }) => {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  const handleCheckboxChange = (key) => {
    let currentPerms = data?.permissions || [];
    if (currentPerms.includes(key)) {
      currentPerms = currentPerms.filter(k => k !== key);
    } else {
      currentPerms = [...currentPerms, key];
    }
    onChange('permissions', currentPerms);
  };

  const isEditing = !!data?.id;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Full Name" name="name" value={data?.name || ''} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Email" name="email" type="email" value={data?.email || ''} onChange={handleChange} required disabled={isEditing} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Role" name="role" value={data?.role || 'admin'} onChange={handleChange}>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="controller">Controller</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="College" name="college" value={data?.college || ''} onChange={handleChange}>
          {collegesList.map((c) => (
            <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
          ))}
          <MenuItem value="Unassigned">Unassigned</MenuItem>
        </TextField>
      </Grid>
      {!isEditing && (
        <>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Password" name="password" type="password" value={data?.password || ''} onChange={handleChange} required />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={data?.confirmPassword || ''} onChange={handleChange} required />
          </Grid>
        </>
      )}
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, mt: 1 }}>
          Permissions
        </Typography>
        <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.08)' }}>
          <FormGroup row>
            {permissions.map((perm) => (
              <FormControlLabel
                key={perm.key}
                control={
                  <Checkbox
                    checked={data?.permissions?.includes(perm.key) || false}
                    onChange={() => handleCheckboxChange(perm.key)}
                    sx={{ color: '#475569', '&.Mui-checked': { color: '#6366f1' } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{perm.label}</Typography>}
                sx={{ mr: 3, mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AdminForm;
