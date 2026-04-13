import React from 'react';
import { TextField, Grid, MenuItem, Typography } from '@mui/material';

const PlanForm = ({ data, onChange }) => {
  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.type === 'number') val = Number(val);
    onChange(e.target.name, val);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Plan Name" name="name" value={data?.name || ''} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Price (₹)" name="price" type="number" value={data?.price || ''} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Duration" name="duration" value={data?.duration || 30} onChange={handleChange}>
          <MenuItem value={30}>1 Month</MenuItem>
          <MenuItem value={90}>3 Months</MenuItem>
          <MenuItem value={180}>6 Months</MenuItem>
          <MenuItem value={365}>1 Year</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Status" name="status" value={data?.status || 'active'} onChange={handleChange}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1, mt: 1 }}>
          Limits
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Max Buses" name="maxBuses" type="number" value={data?.maxBuses || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Max Users" name="maxUsers" type="number" value={data?.maxUsers || ''} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Max Controllers" name="maxControllers" type="number" value={data?.maxControllers || ''} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default PlanForm;
