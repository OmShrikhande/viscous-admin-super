import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Button, Stack, CircularProgress } from '@mui/material';
import { Download, TrendingUp, People, DirectionsBus } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import StatsCard from '../../components/common/StatsCard';
import { downloadFile } from '../../utils/helpers';

const ReportsPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/v1/reports/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchReports();
  }, [token, fetchReports]);

  const handleExport = (type) => {
    if (!data) return;
    const csv = 'Month,Colleges,Users\n' +
      data.growthData.map((d) => `${d.name},${d.Colleges},${d.Users}`).join('\n');
    downloadFile(csv, `report_${type}_${Date.now()}.csv`);
  };

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="System usage insights, growth metrics, and operational reports"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Reports' }]}
      />

      {loading || !data ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatsCard title="Total Growth" value={data.quickStats.totalGrowth} icon={TrendingUp} color="#10b981" subtitle="Year over year" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatsCard title="Avg. Daily Logins" value={data.quickStats.avgDailyLogins} icon={People} color="#6366f1" subtitle="Last 7 days" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatsCard title="Platform Uptime" value={data.quickStats.platformUptime} icon={DirectionsBus} color="#8b5cf6" subtitle="Last 30 days" />
            </Grid>
          </Grid>

          {/* Export buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 3, justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport('growth')} sx={{ borderColor: 'rgba(148,163,184,0.2)', color: '#94a3b8' }}>
              Export Growth
            </Button>
            <Button variant="outlined" startIcon={<Download />} onClick={() => handleExport('usage')} sx={{ borderColor: 'rgba(148,163,184,0.2)', color: '#94a3b8' }}>
              Export Usage
            </Button>
          </Stack>

          {/* Charts */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ChartCard
                title="System Usage"
                subtitle="API requests, logins, and tracking events this week"
                type="bar"
                data={data.usageData}
                dataKeys={['requests', 'logins', 'tracking']}
                colors={['#6366f1', '#10b981', '#f59e0b']}
                height={300}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <ChartCard
                title="College Distribution"
                subtitle="By status"
                type="pie"
                data={data.statusDistribution}
                dataKeys={['value']}
                height={300}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <ChartCard
                title="Platform Growth"
                subtitle="Colleges and users over time"
                type="area"
                data={data.growthData}
                dataKeys={['Colleges', 'Users']}
                colors={['#6366f1', '#3b82f6']}
                height={280}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <ChartCard
                title="Revenue vs Expenses"
                subtitle="Monthly financial overview"
                type="line"
                data={data.revenueData}
                dataKeys={['revenue', 'expenses']}
                colors={['#10b981', '#ef4444']}
                height={280}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ReportsPage;
