import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  School,
  AdminPanelSettings,
  DirectionsBus,
  People,
  MonitorHeart,
  PersonOff,
  Warning,
  CheckCircle,
  Info,
  Add,
  Block,
} from '@mui/icons-material';
import StatsCard from '../../components/common/StatsCard';
import ChartCard from '../../components/common/ChartCard';
import PageHeader from '../../components/common/PageHeader';
import { timeAgo, formatNumber } from '../../utils/helpers';

const activityIcons = {
  create: <Add sx={{ fontSize: 18, color: '#10b981' }} />,
  warning: <Warning sx={{ fontSize: 18, color: '#f59e0b' }} />,
  info: <Info sx={{ fontSize: 18, color: '#3b82f6' }} />,
  error: <Block sx={{ fontSize: 18, color: '#ef4444' }} />,
  success: <CheckCircle sx={{ fontSize: 18, color: '#10b981' }} />,
};

const alertSeverityColors = {
  error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: '#f59e0b' },
  info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: '#3b82f6' },
  success: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', icon: '#10b981' },
};

const DashboardPage = () => {
  const { token } = useSelector((state) => state.auth);
  
  const [metrics, setMetrics] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [metricsRes, growthRes, activityRes, alertsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/dashboard/metrics', { headers }),
          fetch('http://localhost:5000/api/v1/dashboard/growth', { headers }),
          fetch('http://localhost:5000/api/v1/dashboard/recent-activity', { headers }),
          fetch('http://localhost:5000/api/v1/dashboard/alerts', { headers })
        ]);

        const [metricsData, growthDataPayload, activityData, alertsData] = await Promise.all([
          metricsRes.json(),
          growthRes.json(),
          activityRes.json(),
          alertsRes.json(),
        ]);

        if (metricsData.success) setMetrics(metricsData.data);
        if (growthDataPayload.success) {
           setGrowthData(growthDataPayload.data.map((d) => ({ name: d.date, Colleges: d.colleges, Users: d.users, Admins: d.admins })));
        }
        if (activityData.success) setRecentActivity(activityData.data);
        if (alertsData.success) setAlerts(alertsData.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading || !metrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Create a minimal status distribution pie logic based on realistic metrics
  const statusDistribution = [
    { name: 'Active Colleges', value: metrics.activeColleges || 0, color: '#10b981' },
    { name: 'Inactive Colleges', value: metrics.inactiveColleges || 0, color: '#f59e0b' },
  ].filter(i => i.value > 0);
  
  if (statusDistribution.length === 0) {
      statusDistribution.push({ name: 'No Colleges', value: 1, color: '#475569' });
  }

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your platform."
      />

      {/* Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="Total Colleges" value={formatNumber(metrics.totalColleges)} icon={School} color="#6366f1" trend="up" trendValue={metrics.trends?.collegeGrowth || "0%"} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="Active Admins" value={formatNumber(metrics.activeAdmins)} icon={AdminPanelSettings} color="#10b981" trend="up" trendValue={metrics.trends?.adminGrowth || "0%"} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="Inactive Admins" value={formatNumber(metrics.inactiveAdmins)} icon={PersonOff} color="#f59e0b" trend="down" trendValue="-0%" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="Total Buses" value={formatNumber(metrics.totalBuses)} icon={DirectionsBus} color="#8b5cf6" trend="up" trendValue={metrics.trends?.busGrowth || "0%"} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="Total Users" value={formatNumber(metrics.totalUsers)} icon={People} color="#3b82f6" trend="up" trendValue={metrics.trends?.userGrowth || "0%"} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatsCard title="System Health" value={`${metrics.systemHealth?.score || 100}%`} icon={MonitorHeart} color="#10b981" subtitle="All systems operational" />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartCard
            title="Growth Overview"
            subtitle="Platform growth over the last few months"
            type="area"
            data={growthData}
            dataKeys={['Colleges', 'Admins']}
            colors={['#6366f1', '#10b981']}
            height={280}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <ChartCard
            title="College Status / Traffic"
            subtitle="Distribution by status"
            type="pie"
            data={statusDistribution}
            dataKeys={['value']}
            height={280}
          />
        </Grid>
      </Grid>

      {/* Activity & Alerts Row */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  Recent Activity
                </Typography>
              </Box>
              <List sx={{ py: 0 }}>
                {recentActivity.length > 0 ? recentActivity.map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderBottom: '1px solid rgba(148,163,184,0.04)',
                      '&:hover': { background: 'rgba(148,163,184,0.04)' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: `${alertSeverityColors[activity.type === 'create' ? 'success' : activity.type]?.bg || 'rgba(148,163,184,0.1)'}`,
                        }}
                      >
                        {activityIcons[activity.type] || <Info />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primaryTypographyProps={{ component: 'div' }}
                      secondaryTypographyProps={{ component: 'div' }}
                      primary={
                        <Typography component="div" variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.85rem' }}>
                          {activity.action}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.3 }}>
                          <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600 }}>
                            {activity.target}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#475569' }}>
                            • {activity.actor}
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="caption" sx={{ color: '#475569', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>
                      {timeAgo(activity.timestamp || activity.time)}
                    </Typography>
                  </ListItem>
                )) : (
                   <Box sx={{ p: 3, textAlign: 'center' }}>
                     <Typography variant="body2" color="#64748b">No recent activity found in the database.</Typography>
                   </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)', height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                  System Alerts
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {alerts.length > 0 ? alerts.map((alert) => {
                  const colors = alertSeverityColors[alert.severity] || alertSeverityColors.info;
                  return (
                    <Box
                      key={alert.id}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.85rem', mb: 0.3 }}>
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {timeAgo(alert.createdAt || alert.time)}
                        </Typography>
                      </Box>
                      <Chip
                        label={alert.severity}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          height: 22,
                          textTransform: 'uppercase',
                          background: `${colors.icon}20`,
                          color: colors.icon,
                        }}
                      />
                    </Box>
                  );
                }) : (
                   <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, pb: 1 }}>
                     <Typography variant="body2" color="#64748b">No active system alerts.</Typography>
                   </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
