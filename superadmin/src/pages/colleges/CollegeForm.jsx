import React from 'react';
import { TextField, Grid, MenuItem } from '@mui/material';

const CollegeForm = ({ data, onChange, plansList = [] }) => {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="College Name" name="name" value={data?.name || ''} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="College Code" name="code" value={data?.code || ''} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="City" name="city" value={data?.city || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="State" name="state" value={data?.state || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Contact Email" name="contactEmail" type="email" value={data?.contactEmail || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Contact Phone" name="contactPhone" value={data?.contactPhone || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Plan" name="plan" value={data?.plan || ''} onChange={handleChange}>
          {plansList.length > 0 ? (
            plansList.map((p) => (
              <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>
            ))
          ) : (
            <MenuItem value="Basic">Basic (Default)</MenuItem>
          )}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Status" name="status" value={data?.status || 'active'} onChange={handleChange}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Address" name="address" multiline rows={2} value={data?.address || ''} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default CollegeForm;
