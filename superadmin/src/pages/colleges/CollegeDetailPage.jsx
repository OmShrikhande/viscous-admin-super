import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Tabs, Tab, Avatar,
  List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Divider, Button
} from '@mui/material';
import {
  School, DirectionsBus, AdminPanelSettings, People,
  Edit, ArrowBack
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import StatsCard from '../../components/common/StatsCard';
import { formatDate, getInitials, stringToColor } from '../../utils/helpers';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(0);
  const [college, setCollege] = useState(null);
  const [assignedAdmins, setAssignedAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch college data & all admins
        const [collegeRes, adminsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/v1/colleges/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`http://localhost:5000/api/v1/admins`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const collegeJson = await collegeRes.json();
        const adminsJson = await adminsRes.json();

        if (collegeJson.success) {
          setCollege(collegeJson.data);

          if (adminsJson.success) {
            // Filter admins belonging to this college
            const filtered = adminsJson.data.filter(a => a.college === collegeJson.data.name);
            setAssignedAdmins(filtered);
          }
        }
      } catch (err) {
        console.error('Error fetching college details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [id, token]);

  if (loading || !college) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={college.name}
        subtitle={`${college.city || 'No City'}, ${college.state || 'No State'} · Code: ${college.code}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Colleges', path: '/colleges' },
          { label: college.name },
        ]}
        action="Edit College"
        actionIcon={Edit}
        onAction={() => navigate('/colleges')}
      />

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatsCard title="Status" value={college.status || 'inactive'} icon={School} color={college.status === 'active' ? '#10b981' : '#f59e0b'} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatsCard title="Buses" value={college.buses || 0} icon={DirectionsBus} color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatsCard title="Controllers" value={assignedAdmins.length} icon={AdminPanelSettings} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatsCard title="Users" value={college.users || 0} icon={People} color="#3b82f6" />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.08)' }}>
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
          <Tab label="Overview" />
          <Tab label="Controllers" />
          <Tab label="Plan Details" />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  College Information
                </Typography>
                {[
                  ['Name', college.name],
                  ['Code', college.code],
                  ['City', college.city || 'N/A'],
                  ['State', college.state || 'N/A'],
                  ['Created', college.createdAt ? formatDate(college.createdAt) : 'Unknown'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  Plan Information
                </Typography>
                {[
                  ['Current Plan', college.plan || 'Basic'],
                  ['Status', college.status || 'inactive'],
                  ['Buses Count', college.buses || 0],
                  ['Users Count', college.users || 0],
                ].map(([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{label}</Typography>
                    <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>{value}</Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <List>
              {assignedAdmins.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#475569', textAlign: 'center', py: 4 }}>
                  No controllers logically assigned
                </Typography>
              ) : (
                assignedAdmins.map((admin) => (
                  <ListItem key={admin.id} sx={{ px: 0, borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                    <ListItemAvatar>
                      <Avatar sx={{ background: stringToColor(admin.name), width: 38, height: 38, fontSize: '0.85rem' }}>
                         {getInitials(admin.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>{admin.name}</Typography>}
                      secondary={admin.email}
                    />
                    <StatusBadge status={admin.status || 'inactive'} />
                  </ListItem>
                ))
              )}
            </List>
          )}

          {tab === 2 && (
            <Box>
              <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#818cf8', mb: 1 }}>
                  {college.plan || 'Basic'} Plan
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Active subscription showing live mapping with currently {college.buses || 0} loaded buses and {college.users || 0} user endpoints.
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollegeDetailPage;
