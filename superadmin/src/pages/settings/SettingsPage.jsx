import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Grid, Card, CardContent, Typography, Switch, Slider, TextField,
  FormControlLabel, Button, Stack, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';

const SettingsPage = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseToast = () => setToast((prev) => ({ ...prev, open: false }));

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchSettings();
  }, [token, fetchSettings]);

  const updateToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setToast({ open: true, message: 'Settings saved successfully!', severity: 'success' });
      } else {
        setToast({ open: true, message: data.message || 'Error saving settings', severity: 'error' });
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setToast({ open: true, message: 'Network error saving settings', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Settings"
        subtitle="Manage system-wide configurations and feature flags"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Settings' }]}
      />

      <Grid container spacing={3}>
        {/* Tracking Configuration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Tracking Configuration
              </Typography>

              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 600 }}>
                GPS Tracking Interval
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Slider
                  value={settings.trackingInterval || 15}
                  onChange={(_, v) => setSettings({ ...settings, trackingInterval: v })}
                  min={5}
                  max={60}
                  step={5}
                  marks={[
                    { value: 5, label: '5s' },
                    { value: 15, label: '15s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '60s' },
                  ]}
                  sx={{
                    flex: 1,
                    color: '#6366f1',
                    '& .MuiSlider-markLabel': { color: '#64748b', fontSize: '0.7rem' },
                  }}
                />
                <TextField
                  value={settings.trackingInterval || 15}
                  onChange={(e) => setSettings({ ...settings, trackingInterval: Number(e.target.value) })}
                  type="number"
                  size="small"
                  sx={{ width: 80 }}
                  InputProps={{ endAdornment: <Typography variant="caption" sx={{ color: '#64748b' }}>sec</Typography> }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                Lower intervals provide more accurate tracking but increase server load and data usage.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Rules */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Notification Rules
              </Typography>

              {settings.notificationRules && Object.entries(settings.notificationRules).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {key.includes('sms') ? 'SMS notification' : 'Email notification'}
                    </Typography>
                  </Box>
                  <Switch
                    checked={value}
                    onChange={() => updateToggle('notificationRules', key)}
                    sx={{
                      '& .Mui-checked': { color: '#6366f1' },
                      '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#6366f1' },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Toggles */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Feature Toggles
              </Typography>

              <Grid container spacing={2}>
                {settings.featureToggles && Object.entries(settings.featureToggles).map(([key, value]) => (
                  <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: value ? 'rgba(99,102,241,0.06)' : 'rgba(148,163,184,0.04)',
                        border: `1px solid ${value ? 'rgba(99,102,241,0.15)' : 'rgba(148,163,184,0.08)'}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 0.3 }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                        </Typography>
                        <Typography variant="caption" sx={{ color: value ? '#10b981' : '#64748b', fontWeight: 600 }}>
                          {value ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </Box>
                      <Switch
                        checked={value}
                        onChange={() => updateToggle('featureToggles', key)}
                        sx={{
                          '& .Mui-checked': { color: '#10b981' },
                          '& .Mui-checked + .MuiSwitch-track': { backgroundColor: '#10b981' },
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Actions */}
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={fetchSettings} disabled={saving} startIcon={<Refresh />} sx={{ borderColor: 'rgba(148,163,184,0.2)', color: '#94a3b8' }}>
          Reset
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} startIcon={<Save />}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
